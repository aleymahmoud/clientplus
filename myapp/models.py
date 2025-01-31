from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal

class Client(models.Model):
    CLIENTNAME = models.CharField(max_length=200)
    TYPE_CHOICES = [
        ('RET', 'Retainer'),
        ('PRJ', 'Project'),
        ('FFNT', 'FFNT'),
    ]
    Type = models.CharField(max_length=4, choices=TYPE_CHOICES)
    STATUS_CHOICES = [
        ('A', 'Active'),
        ('E', 'Ended'),
    ]
    St = models.CharField(max_length=1, choices=STATUS_CHOICES)
    ACTIVITY_CHOICES = [
        ('Client', 'Client'),
        ('FFNT', 'FFNT'),
    ]
    Activity = models.CharField(max_length=10, choices=ACTIVITY_CHOICES)

    def __str__(self):
        return self.CLIENTNAME

    @property
    def display_name(self):
        """Return a display name for the client including status"""
        return f"{self.CLIENTNAME} ({self.get_Type_display()})"

    class Meta:
        ordering = ['CLIENTNAME']

class TimeEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    date = models.DateField()
    hours = models.DecimalField(
        max_digits=4, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name_plural = 'Time entries'

    def __str__(self):
        return f"{self.user.username} - {self.client.CLIENTNAME} - {self.date}"

    @property
    def activity_type(self):
        if self.client.CLIENTNAME in ["FF Ex-Meeting", "FF In-Meeting", "Forefront", "The Community"]:
            return "FFNT"
        return "Client"

class HistData(models.Model):
    Source = models.CharField(max_length=50, default='Client Plus')
    Year = models.IntegerField()
    MonthNo = models.IntegerField()
    Day = models.IntegerField()
    Month = models.CharField(max_length=20)  # Full month name
    ConsultantID = models.IntegerField()
    Consultant = models.CharField(max_length=100)
    Client = models.CharField(max_length=200)
    ActivityType = models.CharField(max_length=10)
    WorkingHours = models.DecimalField(max_digits=5, decimal_places=2)
    NOTES = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = 'Historical Data'
        verbose_name_plural = 'Historical Data'

class ConsultantDeal(models.Model):
    Consultant = models.CharField(max_length=100)
    ConsultantID = models.IntegerField()
    Year = models.IntegerField()
    Month = models.IntegerField()
    DealDays = models.IntegerField()

    class Meta:
        unique_together = ('Consultant', 'Year', 'Month')

class ConsultantVacation(models.Model):
    Consultant = models.CharField(max_length=100)
    Days = models.IntegerField()
    Year = models.IntegerField()
    Month = models.IntegerField()

    class Meta:
        unique_together = ('Consultant', 'Year', 'Month')

class PagePermissions(models.Model):
    User = models.CharField(max_length=100)
    Page = models.CharField(max_length=100)
    ACCESS_CHOICES = [
        ('Show', 'Show'),
        ('Hide', 'Hide'),
    ]
    Access = models.CharField(max_length=4, choices=ACCESS_CHOICES)

    class Meta:
        unique_together = ('User', 'Page')