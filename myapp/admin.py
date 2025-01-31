from django.contrib import admin
from .models import Client, TimeEntry, HistData, ConsultantDeal, ConsultantVacation, PagePermissions

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('CLIENTNAME', 'Type', 'St', 'Activity')
    list_filter = ('Type', 'St', 'Activity')
    search_fields = ('CLIENTNAME',)
    ordering = ('CLIENTNAME',)

@admin.register(TimeEntry)
class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'client', 'date', 'hours', 'activity_type')
    list_filter = ('date', 'user', 'client')
    search_fields = ('notes', 'client__CLIENTNAME')
    date_hierarchy = 'date'
    ordering = ('-date', '-created_at')

@admin.register(HistData)
class HistDataAdmin(admin.ModelAdmin):
    list_display = ('Consultant', 'Client', 'Year', 'Month', 'Day', 'WorkingHours')
    list_filter = ('Year', 'Month', 'Consultant')
    search_fields = ('Consultant', 'Client')
    ordering = ('-Year', '-MonthNo', '-Day')

@admin.register(ConsultantDeal)
class ConsultantDealAdmin(admin.ModelAdmin):
    list_display = ('Consultant', 'ConsultantID', 'Year', 'Month', 'DealDays')
    list_filter = ('Year', 'Month', 'Consultant')
    search_fields = ('Consultant',)
    ordering = ('Consultant', 'Year', 'Month')

@admin.register(ConsultantVacation)
class ConsultantVacationAdmin(admin.ModelAdmin):
    list_display = ('Consultant', 'Year', 'Month', 'Days')
    list_filter = ('Year', 'Month', 'Consultant')
    search_fields = ('Consultant',)
    ordering = ('Consultant', 'Year', 'Month')

@admin.register(PagePermissions)
class PagePermissionsAdmin(admin.ModelAdmin):
    list_display = ('User', 'Page', 'Access')
    list_filter = ('Access',)
    search_fields = ('User', 'Page')
    ordering = ('User', 'Page')