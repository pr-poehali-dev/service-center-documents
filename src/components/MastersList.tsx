import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import type { Master, Order } from '@/pages/Index';

interface MastersListProps {
  masters: Master[];
  orders: Order[];
}

const MastersList = ({ masters, orders }: MastersListProps) => {
  const getMasterStats = (masterId: string) => {
    const masterOrders = orders.filter(o => o.masterId === masterId);
    const completed = masterOrders.filter(o => o.status === 'completed').length;
    const inProgress = masterOrders.filter(o => o.status === 'in_progress').length;
    const pending = masterOrders.filter(o => o.status === 'pending').length;

    return { total: masterOrders.length, completed, inProgress, pending };
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Мастера</h2>
        <p className="text-muted-foreground">Всего мастеров: {masters.length}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {masters.map(master => {
          const stats = getMasterStats(master.id);
          return (
            <Card key={master.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="User" className="text-primary" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{master.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{master.login}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Всего заказов:</span>
                  <Badge variant="secondary" className="font-semibold">
                    {stats.total}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Завершено</span>
                    </div>
                    <span className="font-medium">{stats.completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>В работе</span>
                    </div>
                    <span className="font-medium">{stats.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span>Ожидает</span>
                    </div>
                    <span className="font-medium">{stats.pending}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MastersList;
