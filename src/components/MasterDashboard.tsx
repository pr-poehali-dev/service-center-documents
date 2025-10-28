import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import type { User, Order, Master } from '@/pages/Index';

interface MasterDashboardProps {
  user: User;
  orders: Order[];
  masters: Master[];
  onLogout: () => void;
}

const STATUS_CONFIG = {
  pending: { label: 'Ожидает', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'Clock' },
  in_progress: { label: 'В работе', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'Wrench' },
  completed: { label: 'Завершен', color: 'bg-green-100 text-green-800 border-green-200', icon: 'CheckCircle2' },
};

const MasterDashboard = ({ user, orders, onLogout }: MasterDashboardProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const calculateTotal = (order: Order) => {
    const servicesTotal = order.services.reduce((sum, s) => sum + s.price, 0);
    const materialsTotal = order.materials.reduce((sum, m) => sum + m.total, 0);
    return { servicesTotal, materialsTotal, total: servicesTotal + materialsTotal };
  };

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    pending: orders.filter(o => o.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="User" className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Мои заказы</h1>
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
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="ClipboardList" className="text-primary" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ожидает</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Icon name="Clock" className="text-yellow-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">В работе</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon name="Wrench" className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Завершено</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="CheckCircle2" className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Список заказов</h2>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">У вас пока нет заказов</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {orders.map(order => (
                  <Card
                    key={order.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-base">№ {order.documentNumber}</CardTitle>
                            <Badge variant="outline" className={STATUS_CONFIG[order.status].color}>
                              {STATUS_CONFIG[order.status].label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{order.client}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Wrench" size={14} className="text-muted-foreground" />
                        <span className="font-medium">{order.repairObject}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Calendar" size={14} />
                        <span>{new Date(order.date).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {selectedOrder && (
            <Card className="max-h-[calc(100vh-300px)] overflow-y-auto">
              <CardHeader className="sticky top-0 bg-white z-10 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Заказ № {selectedOrder.documentNumber}</CardTitle>
                  <Badge variant="outline" className={STATUS_CONFIG[selectedOrder.status].color}>
                    {STATUS_CONFIG[selectedOrder.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {selectedOrder.imageUrl && (
                  <img
                    src={selectedOrder.imageUrl}
                    alt={selectedOrder.repairObject}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Клиент</p>
                    <p className="font-medium">{selectedOrder.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Объект ремонта</p>
                    <p className="font-medium">{selectedOrder.repairObject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Описание проблемы</p>
                    <p className="font-medium">{selectedOrder.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Дата заказа</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.date).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="ListChecks" size={18} />
                    Услуги
                  </h3>
                  {selectedOrder.services.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Услуги не указаны</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedOrder.services.map(service => (
                        <div key={service.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                            <p className="font-semibold whitespace-nowrap">
                              {service.price.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="Package" size={18} />
                    Материалы
                  </h3>
                  {selectedOrder.materials.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Материалы не указаны</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedOrder.materials.map(material => (
                        <div key={material.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-medium">{material.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {material.quantity} шт. × {material.pricePerUnit.toLocaleString('ru-RU')} ₽
                              </p>
                            </div>
                            <p className="font-semibold whitespace-nowrap">
                              {material.total.toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="FileText" size={18} />
                    Приходная накладная
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Номер:</span>
                      <span className="font-medium">{selectedOrder.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Дата:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.invoiceDate).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Поставщик:</span>
                      <span className="font-medium">{selectedOrder.supplier}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 p-4 bg-primary/5 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Услуги:</span>
                    <span className="font-medium">
                      {calculateTotal(selectedOrder).servicesTotal.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Материалы:</span>
                    <span className="font-medium">
                      {calculateTotal(selectedOrder).materialsTotal.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Итого:</span>
                    <span className="text-primary">
                      {calculateTotal(selectedOrder).total.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default MasterDashboard;
