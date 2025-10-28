import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import type { User } from '@/pages/Index';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const USERS = [
  { id: '1', login: 'мастер1', password: 'пасс1', role: 'master' as const, name: 'Иван Петров' },
  { id: '2', login: 'мастер2', password: 'пасс2', role: 'master' as const, name: 'Сергей Иванов' },
  { id: '3', login: 'мастер3', password: 'пасс3', role: 'master' as const, name: 'Алексей Смирнов' },
  { id: '4', login: 'мастер4', password: 'пасс4', role: 'master' as const, name: 'Дмитрий Козлов' },
  { id: 'manager', login: 'менеджер', password: 'менеджер', role: 'manager' as const, name: 'Менеджер' },
];

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = USERS.find(u => u.login === login.trim() && u.password === password.trim());

    if (user) {
      onLogin({
        id: user.id,
        login: user.login,
        role: user.role,
        name: user.name,
      });
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2">
            <Icon name="Wrench" className="text-white" size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">Сервисный центр</CardTitle>
          <CardDescription>Войдите в систему для продолжения работы</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                type="text"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-md">
                <Icon name="AlertCircle" size={16} />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full h-11 text-base font-medium">
              Войти
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center mb-3">Тестовые учетные данные:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium">Менеджер:</span> менеджер / менеджер</p>
              <p><span className="font-medium">Мастер:</span> мастер1 / пасс1</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
