'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersianText } from '@/components/persian-text';
import { apiClient } from '@/lib/api-client';

interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const t = useTranslations('admin');
  const { data: session } = useSession();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState<'ALL' | 'USER' | 'ADMIN'>(
    'ALL'
  );

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName &&
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName &&
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === 'ALL' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'ADMIN'
      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          <PersianText>{t('users')}</PersianText>
        </h1>
        <p className="text-muted-foreground">
          <PersianText>{t('usersDescription')}</PersianText>
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>
            <PersianText>{t('filters')}</PersianText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('searchUsers')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRole === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRole('ALL')}
              >
                <PersianText>{t('all')}</PersianText>
              </Button>
              <Button
                variant={filterRole === 'USER' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRole('USER')}
              >
                <PersianText>{t('users')}</PersianText>
              </Button>
              <Button
                variant={filterRole === 'ADMIN' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRole('ADMIN')}
              >
                <PersianText>{t('admins')}</PersianText>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <PersianText>{t('usersList')}</PersianText>
          </CardTitle>
          <CardDescription>
            <PersianText>
              {t('usersListDesc', { count: filteredUsers.length })}
            </PersianText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <PersianText>{t('user')}</PersianText>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <PersianText>{t('email')}</PersianText>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <PersianText>{t('role')}</PersianText>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <PersianText>{t('status')}</PersianText>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <PersianText>{t('createdAt')}</PersianText>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    <PersianText>{t('actions')}</PersianText>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          @{user.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{user.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        <PersianText>{t(user.role.toLowerCase())}</PersianText>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isEmailVerified
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}
                      >
                        <PersianText>
                          {user.isEmailVerified
                            ? t('verified')
                            : t('unverified')}
                        </PersianText>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.id.toString() !== session?.user?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                <PersianText>{t('noUsersFound')}</PersianText>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
