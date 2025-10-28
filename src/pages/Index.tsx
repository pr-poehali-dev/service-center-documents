import { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import ManagerDashboard from '@/components/ManagerDashboard';
import MasterDashboard from '@/components/MasterDashboard';

export type UserRole = 'manager' | 'master';

export interface User {
  id: string;
  login: string;
  role: UserRole;
  name: string;
}

export interface Master {
  id: string;
  name: string;
  login: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Order {
  id: string;
  documentNumber: string;
  date: string;
  client: string;
  masterId: string;
  repairObject: string;
  description: string;
  imageUrl: string;
  services: Service[];
  materials: Material[];
  invoiceNumber: string;
  invoiceDate: string;
  supplier: string;
  status: 'pending' | 'in_progress' | 'completed';
}

const MOCK_MASTERS: Master[] = [
  { id: '1', name: 'Иван Петров', login: 'master1' },
  { id: '2', name: 'Сергей Иванов', login: 'master2' },
  { id: '3', name: 'Алексей Смирнов', login: 'master3' },
  { id: '4', name: 'Дмитрий Козлов', login: 'master4' },
];

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    documentNumber: '0001',
    date: '2024-10-28',
    client: 'ООО "Техника"',
    masterId: '1',
    repairObject: 'Телевизор LG 55"',
    description: 'Не включается, подозрение на блок питания',
    imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
    services: [
      { id: '1', name: 'Диагностика', description: 'Проверка всех систем', price: 500 },
      { id: '2', name: 'Замена блока питания', description: 'Установка нового БП', price: 2000 },
    ],
    materials: [
      { id: '1', name: 'Блок питания LG EAY64511101', quantity: 1, pricePerUnit: 3500, total: 3500 },
    ],
    invoiceNumber: 'ПН-0001',
    invoiceDate: '2024-10-27',
    supplier: 'ООО "ЭлектроСнаб"',
    status: 'in_progress',
  },
  {
    id: '2',
    documentNumber: '0002',
    date: '2024-10-28',
    client: 'Иванова М.А.',
    masterId: '2',
    repairObject: 'Стиральная машина Samsung WW70',
    description: 'Не отжимает белье',
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400',
    services: [
      { id: '3', name: 'Диагностика', description: 'Проверка системы отжима', price: 400 },
      { id: '4', name: 'Замена подшипников', description: 'Замена подшипников барабана', price: 3000 },
    ],
    materials: [
      { id: '2', name: 'Подшипник 6305', quantity: 2, pricePerUnit: 800, total: 1600 },
      { id: '3', name: 'Сальник 37x66x9.5/12', quantity: 1, pricePerUnit: 500, total: 500 },
    ],
    invoiceNumber: 'ПН-0002',
    invoiceDate: '2024-10-27',
    supplier: 'ИП "Запчасти+"',
    status: 'pending',
  },
  {
    id: '3',
    documentNumber: '0003',
    date: '2024-10-29',
    client: 'Петров А.С.',
    masterId: '1',
    repairObject: 'Холодильник Indesit DF 5200',
    description: 'Не морозит холодильная камера',
    imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400',
    services: [
      { id: '5', name: 'Диагностика', description: 'Проверка системы охлаждения', price: 600 },
      { id: '6', name: 'Замена термостата', description: 'Установка нового термостата', price: 1500 },
    ],
    materials: [
      { id: '4', name: 'Термостат K59-L1686', quantity: 1, pricePerUnit: 1200, total: 1200 },
    ],
    invoiceNumber: 'ПН-0003',
    invoiceDate: '2024-10-28',
    supplier: 'ООО "ЭлектроСнаб"',
    status: 'completed',
  },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders([...orders, newOrder]);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === 'manager') {
    return (
      <ManagerDashboard
        user={user}
        orders={orders}
        masters={MOCK_MASTERS}
        onLogout={handleLogout}
        onUpdateOrder={handleUpdateOrder}
        onAddOrder={handleAddOrder}
        onDeleteOrder={handleDeleteOrder}
      />
    );
  }

  return (
    <MasterDashboard
      user={user}
      orders={orders.filter(order => order.masterId === user.id)}
      masters={MOCK_MASTERS}
      onLogout={handleLogout}
    />
  );
};

export default Index;
