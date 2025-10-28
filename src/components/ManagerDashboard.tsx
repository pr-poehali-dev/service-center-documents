import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import type { User, Order, Master } from '@/pages/Index';
import OrdersList from './OrdersList';
import OrderEditor from './OrderEditor';
import MastersList from './MastersList';

interface ManagerDashboardProps {
  user: User;
  orders: Order[];
  masters: Master[];
  onLogout: () => void;
  onUpdateOrder: (order: Order) => void;
  onAddOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const ManagerDashboard = ({
  user,
  orders,
  masters,
  onLogout,
  onUpdateOrder,
  onAddOrder,
  onDeleteOrder,
}: ManagerDashboardProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsCreatingOrder(false);
  };

  const handleCreateNew = () => {
    setIsCreatingOrder(true);
    setSelectedOrder(null);
  };

  const handleSaveOrder = (order: Order) => {
    if (isCreatingOrder) {
      onAddOrder(order);
    } else {
      onUpdateOrder(order);
    }
    setSelectedOrder(null);
    setIsCreatingOrder(false);
  };

  const handleCancelEdit = () => {
    setSelectedOrder(null);
    setIsCreatingOrder(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Wrench" className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Панель менеджера</h1>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <Icon name="LogOut" size={16} />
            Выйти
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
            <TabsTrigger value="orders" className="gap-2">
              <Icon name="ClipboardList" size={16} />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="masters" className="gap-2">
              <Icon name="Users" size={16} />
              Мастера
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <Icon name="BarChart3" size={16} />
              Отчеты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Заказы</h2>
                <p className="text-muted-foreground">Всего заказов: {orders.length}</p>
              </div>
              <Button onClick={handleCreateNew} className="gap-2">
                <Icon name="Plus" size={16} />
                Создать заказ
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <OrdersList
                orders={orders}
                masters={masters}
                selectedOrderId={selectedOrder?.id}
                onSelectOrder={handleSelectOrder}
                onDeleteOrder={onDeleteOrder}
              />

              {(selectedOrder || isCreatingOrder) && (
                <OrderEditor
                  order={selectedOrder}
                  masters={masters}
                  isCreating={isCreatingOrder}
                  onSave={handleSaveOrder}
                  onCancel={handleCancelEdit}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="masters">
            <MastersList masters={masters} orders={orders} />
          </TabsContent>

          <TabsContent value="reports">
            <div className="bg-white rounded-lg p-8 text-center">
              <Icon name="BarChart3" size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Отчеты в разработке</h3>
              <p className="text-muted-foreground">
                Здесь будет статистика по заказам, доходам и работе мастеров
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManagerDashboard;
