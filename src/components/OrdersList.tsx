import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import type { Order, Master } from '@/pages/Index';

interface OrdersListProps {
  orders: Order[];
  masters: Master[];
  selectedOrderId?: string;
  onSelectOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
}

const STATUS_CONFIG = {
  pending: { label: 'Ожидает', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  in_progress: { label: 'В работе', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  completed: { label: 'Завершен', color: 'bg-green-100 text-green-800 border-green-200' },
};

const OrdersList = ({ orders, masters, selectedOrderId, onSelectOrder, onDeleteOrder }: OrdersListProps) => {
  const getMasterName = (masterId: string) => {
    return masters.find(m => m.id === masterId)?.name || 'Не назначен';
  };

  const calculateTotal = (order: Order) => {
    const servicesTotal = order.services.reduce((sum, s) => sum + s.price, 0);
    const materialsTotal = order.materials.reduce((sum, m) => sum + m.total, 0);
    return servicesTotal + materialsTotal;
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Нет заказов</p>
          </CardContent>
        </Card>
      ) : (
        orders.map(order => (
          <Card
            key={order.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedOrderId === order.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectOrder(order)}
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Удалить заказ?')) {
                      onDeleteOrder(order.id);
                    }
                  }}
                  className="h-8 w-8"
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Wrench" size={14} className="text-muted-foreground" />
                <span className="font-medium">{order.repairObject}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="User" size={14} />
                <span>{getMasterName(order.masterId)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Calendar" size={14} />
                <span>{new Date(order.date).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm font-medium text-primary">
                  Итого: {calculateTotal(order).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrdersList;
