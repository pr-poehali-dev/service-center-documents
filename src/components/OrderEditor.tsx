import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import type { Order, Master, Service, Material } from '@/pages/Index';

interface OrderEditorProps {
  order: Order | null;
  masters: Master[];
  isCreating: boolean;
  onSave: (order: Order) => void;
  onCancel: () => void;
}

const OrderEditor = ({ order, masters, isCreating, onSave, onCancel }: OrderEditorProps) => {
  const [formData, setFormData] = useState<Order>(
    order || {
      id: Date.now().toString(),
      documentNumber: '',
      date: new Date().toISOString().split('T')[0],
      client: '',
      masterId: '',
      repairObject: '',
      description: '',
      imageUrl: '',
      services: [],
      materials: [],
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      supplier: '',
      status: 'pending',
    }
  );

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  const handleAddService = () => {
    setFormData({
      ...formData,
      services: [
        ...formData.services,
        { id: Date.now().toString(), name: '', description: '', price: 0 },
      ],
    });
  };

  const handleUpdateService = (index: number, field: keyof Service, value: string | number) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFormData({ ...formData, services: updatedServices });
  };

  const handleRemoveService = (index: number) => {
    setFormData({
      ...formData,
      services: formData.services.filter((_, i) => i !== index),
    });
  };

  const handleAddMaterial = () => {
    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        { id: Date.now().toString(), name: '', quantity: 1, pricePerUnit: 0, total: 0 },
      ],
    });
  };

  const handleUpdateMaterial = (index: number, field: keyof Material, value: string | number) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    
    if (field === 'quantity' || field === 'pricePerUnit') {
      const qty = field === 'quantity' ? Number(value) : updatedMaterials[index].quantity;
      const price = field === 'pricePerUnit' ? Number(value) : updatedMaterials[index].pricePerUnit;
      updatedMaterials[index].total = qty * price;
    }
    
    setFormData({ ...formData, materials: updatedMaterials });
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const calculateTotal = () => {
    const servicesTotal = formData.services.reduce((sum, s) => sum + Number(s.price), 0);
    const materialsTotal = formData.materials.reduce((sum, m) => sum + m.total, 0);
    return { servicesTotal, materialsTotal, total: servicesTotal + materialsTotal };
  };

  const totals = calculateTotal();

  return (
    <Card className="max-h-[calc(100vh-300px)] overflow-y-auto">
      <CardHeader className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{isCreating ? 'Создание заказа' : `Редактирование № ${formData.documentNumber}`}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <Icon name="X" size={20} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentNumber">Номер документа</Label>
              <Input
                id="documentNumber"
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Дата</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Клиент</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="masterId">Мастер</Label>
            <Select value={formData.masterId} onValueChange={(value) => setFormData({ ...formData, masterId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите мастера" />
              </SelectTrigger>
              <SelectContent>
                {masters.map((master) => (
                  <SelectItem key={master.id} value={master.id}>
                    {master.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repairObject">Объект ремонта</Label>
            <Input
              id="repairObject"
              value={formData.repairObject}
              onChange={(e) => setFormData({ ...formData, repairObject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание проблемы</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL изображения</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="completed">Завершен</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Услуги</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddService} className="gap-2">
                <Icon name="Plus" size={14} />
                Добавить
              </Button>
            </div>
            {formData.services.map((service, index) => (
              <div key={service.id} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <Input
                      placeholder="Название услуги"
                      value={service.name}
                      onChange={(e) => handleUpdateService(index, 'name', e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Стоимость"
                      type="number"
                      value={service.price}
                      onChange={(e) => handleUpdateService(index, 'price', Number(e.target.value))}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveService(index)}
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
                <Input
                  placeholder="Описание"
                  value={service.description}
                  onChange={(e) => handleUpdateService(index, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Материалы</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddMaterial} className="gap-2">
                <Icon name="Plus" size={14} />
                Добавить
              </Button>
            </div>
            {formData.materials.map((material, index) => (
              <div key={material.id} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                <div className="flex items-start gap-2">
                  <div className="grid grid-cols-4 gap-2 flex-1">
                    <Input
                      placeholder="Название"
                      value={material.name}
                      onChange={(e) => handleUpdateMaterial(index, 'name', e.target.value)}
                      required
                      className="col-span-2"
                    />
                    <Input
                      placeholder="Кол-во"
                      type="number"
                      value={material.quantity}
                      onChange={(e) => handleUpdateMaterial(index, 'quantity', Number(e.target.value))}
                      required
                    />
                    <Input
                      placeholder="Цена"
                      type="number"
                      value={material.pricePerUnit}
                      onChange={(e) => handleUpdateMaterial(index, 'pricePerUnit', Number(e.target.value))}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMaterial(index)}
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Итого: {material.total.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Номер накладной</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Дата накладной</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Поставщик</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Услуги:</span>
              <span className="font-medium">{totals.servicesTotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Материалы:</span>
              <span className="font-medium">{totals.materialsTotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Итого:</span>
              <span className="text-primary">{totals.total.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {isCreating ? 'Создать заказ' : 'Сохранить изменения'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderEditor;
