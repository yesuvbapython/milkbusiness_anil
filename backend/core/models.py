from django.db import models
from django.utils import timezone

class Route(models.Model):
    name = models.CharField(max_length=10, unique=True)  # M3, M4, etc.
    
    def __str__(self):
        return self.name

class BusinessPoint(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)  # Shekara, Agent M4, etc.
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        return f"{self.route.name} - {self.name}"

class Supplier(models.Model):
    name = models.CharField(max_length=100)  # gowardhan, gowardhan curd, start milk, etc.
    
    def __str__(self):
        return self.name

class Product(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)  # TM 225 gms, TM 500, etc.
    
    @property
    def crate_multiplier(self):
        if '200' in self.name.upper():
            return 60
        return 12
    
    def __str__(self):
        return f"{self.supplier.name} - {self.name}"

class RouteRate(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, default=1)
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        unique_together = ['route', 'product']

class BusinessPointRate(models.Model):
    business_point = models.ForeignKey(BusinessPoint, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, default=1)
    rate = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        unique_together = ['business_point', 'product']

class CrateDistribution(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    crates_given = models.IntegerField(default=0)
    
    @property
    def total_units(self):
        return self.crates_given * self.product.crate_multiplier
    
    class Meta:
        unique_together = ['route', 'supplier', 'product', 'date']

class BusinessPointCrateDistribution(models.Model):
    business_point = models.ForeignKey(BusinessPoint, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    crates_given = models.IntegerField(default=0)
    
    @property
    def total_units(self):
        return self.crates_given * self.product.crate_multiplier
    
    class Meta:
        unique_together = ['business_point', 'supplier', 'product', 'date']

class DailySales(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    opening_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sales_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    received_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    other_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_liters = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    @property
    def total_amount(self):
        return self.opening_balance + self.sales_amount
    
    @property
    def net_balance(self):
        return self.total_amount - self.received_amount - self.other_deductions
    
    class Meta:
        unique_together = ['route', 'date']

class BusinessPointDailySales(models.Model):
    business_point = models.ForeignKey(BusinessPoint, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    opening_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sales_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    received_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    other_deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_liters = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    @property
    def total_amount(self):
        return self.opening_balance + self.sales_amount
    
    @property
    def net_balance(self):
        return self.total_amount - self.received_amount - self.other_deductions
    
    class Meta:
        unique_together = ['business_point', 'date']

class AgentCashFlow(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    inward_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)  # received from route
    outward_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)  # investment on milk/curd
    
    @property
    def closing_balance(self):
        return self.inward_amount - self.outward_amount
    
    class Meta:
        unique_together = ['route', 'date']

class BankCashFlow(models.Model):
    date = models.DateField(default=timezone.now)
    credit_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    debit_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    description = models.CharField(max_length=200, blank=True)
    
    @property
    def net_amount(self):
        return self.credit_amount - self.debit_amount

class Production(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    crates_produced = models.IntegerField(default=0)
    crates_distributed = models.IntegerField(default=0)
    crates_remaining = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    
    @property
    def total_units_produced(self):
        return self.crates_produced * self.product.crate_multiplier
    
    @property
    def total_units_distributed(self):
        return self.crates_distributed * self.product.crate_multiplier
    
    @property
    def total_units_remaining(self):
        return self.crates_remaining * self.product.crate_multiplier
    
    def save(self, *args, **kwargs):
        # Auto-calculate remaining crates
        self.crates_remaining = self.crates_produced - self.crates_distributed
        super().save(*args, **kwargs)
    
    class Meta:
        unique_together = ['route', 'supplier', 'product', 'date']
    
    def __str__(self):
        return f"{self.route.name} - {self.supplier.name} - {self.product.name} ({self.date})"