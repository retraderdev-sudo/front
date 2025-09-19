'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OtpInput } from '@/components/ui/otp-input';
import { getValidationSchema } from '@/lib/validation';
import { sendOtp } from '@/lib/auth-api';
import { useAuthRedirect, getRedirectPath } from '@/utils/auth-redirect';
import { useLocalizedRouter } from '@/hooks/use-localized-router';

interface LoginFormData {
  email: string;
  password?: string;
  loginMethod: 'password' | 'otp';
}

interface OtpFormData {
  otp: string;
}

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>(
    'password'
  );
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const localizedRouter = useLocalizedRouter();
  const t = useTranslations('auth');

  // Redirect if already authenticated
  useAuthRedirect();

  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      loginMethod: 'password',
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: yupResolver(getValidationSchema('otp')),
    defaultValues: {
      otp: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      if (data.loginMethod === 'otp') {
        // For OTP login, first send OTP
        const otpResult = await sendOtp(data.email);
        if (otpResult.success) {
          setEmail(data.email);
          setStep('otp');
          toast.success(t('otpSent'));
          setIsLoading(false);
          return;
        } else {
          throw new Error(otpResult.message);
        }
      }

      // Sign in with NextAuth
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        loginMethod: data.loginMethod,
        redirect: false,
      });

      if (signInResult?.ok) {
        toast.success(t('welcomeMessage'));
        // Get the session to determine user role and redirect accordingly
        const session = await getSession();
        const redirectPath = getRedirectPath(session?.user?.role);
        localizedRouter.push(redirectPath);
      } else {
        toast.error(t('signinError'));
      }
    } catch (error: any) {
      toast.error(error.message || t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (data: OtpFormData) => {
    setOtpLoading(true);
    try {
      // Sign in with NextAuth using OTP
      const signInResult = await signIn('credentials', {
        email,
        otp: data.otp,
        loginMethod: 'otp',
        redirect: false,
      });

      if (signInResult?.ok) {
        toast.success(t('welcomeMessage'));
        // Get the session to determine user role and redirect accordingly
        const session = await getSession();
        const redirectPath = getRedirectPath(session?.user?.role);
        localizedRouter.push(redirectPath);
      } else {
        toast.error(t('signinError'));
      }
    } catch (error: any) {
      toast.error(error.message || t('otpError'));
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const result = await sendOtp(email);
      if (result.success) {
        toast.success(t('otpResent'));
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || t('otpResendError'));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/' }); // Let middleware handle redirect
    } catch (error) {
      toast.error(t('googleLoginError'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('loginTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{t('loginSubtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('signInToAccount')}</CardTitle>
            <CardDescription>
              {step === 'form' ? t('loginDescription') : t('otpDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'form' ? (
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">{t('emailLogin')}</TabsTrigger>
                  <TabsTrigger value="social">{t('socialLogin')}</TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <form
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t('email')}
                      </label>
                      <Input
                        id="email"
                        type="email"
                        {...loginForm.register('email')}
                        className="mt-1"
                        placeholder={t('emailPlaceholder')}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {loginMethod === 'password' && (
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          {t('password')}
                        </label>
                        <Input
                          id="password"
                          type="password"
                          {...loginForm.register('password')}
                          className="mt-1"
                          placeholder={t('passwordPlaceholder')}
                        />
                        {loginForm.formState.errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="password-login"
                          type="radio"
                          name="loginMethod"
                          value="password"
                          checked={loginMethod === 'password'}
                          onChange={() => setLoginMethod('password')}
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="password-login"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {t('passwordLogin')}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="otp-login"
                          type="radio"
                          name="loginMethod"
                          value="otp"
                          checked={loginMethod === 'otp'}
                          onChange={() => setLoginMethod('otp')}
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="otp-login"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {t('otpLogin')}
                        </label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? t('signingIn') : t('signIn')}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      onClick={handleGoogleLogin}
                      variant="outline"
                      className="w-full"
                    >
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {t('signInWithGoogle')}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {t('otpSentTo')}{' '}
                    <span className="font-medium">{email}</span>
                  </p>
                </div>

                <form
                  onSubmit={otpForm.handleSubmit(handleOtpVerification)}
                  className="space-y-6"
                >
                  <div className="flex justify-center">
                    <OtpInput
                      value={otpForm.watch('otp')}
                      onChange={(value) => otpForm.setValue('otp', value)}
                      onComplete={(value) => otpForm.setValue('otp', value)}
                      error={otpForm.formState.errors.otp?.message}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={otpLoading || otpForm.watch('otp').length !== 6}
                  >
                    {otpLoading ? t('verifying') : t('verifyOtp')}
                  </Button>
                </form>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                    className="text-sm"
                  >
                    {resendCooldown > 0
                      ? t('resendIn', { seconds: resendCooldown })
                      : t('resendOtp')}
                  </Button>
                </div>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => setStep('form')}
                    className="text-sm"
                  >
                    {t('backToLogin')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {t('dontHaveAccount')}{' '}
            <Link
              href="/signup"
              className="font-medium text-primary hover:text-primary/80"
            >
              {t('signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
