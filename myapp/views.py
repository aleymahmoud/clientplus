from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from .forms import TimeEntryForm
from .models import TimeEntry, Client  # Added Client import here


def home(request):
    """Home page view"""
    if request.user.is_authenticated:
        return redirect('data_entry')
    return redirect('login')

@login_required
def data_entry(request):
    """Data entry page view"""
    today = timezone.now().date()
    
    # Get today's entries
    today_entries = TimeEntry.objects.filter(
        user=request.user,
        date=today
    ).select_related('client').order_by('-created_at')

    if request.method == 'POST':
        form = TimeEntryForm(request.POST)
        if form.is_valid():
            entry = form.save(commit=False)
            entry.user = request.user
            entry.date = today
            entry.save()
            messages.success(request, 'Time entry added successfully!')
            return redirect('data_entry')
    else:
        form = TimeEntryForm()  # This will now only show active clients

    return render(request, 'myapp/data_entry.html', {
        'form': form,
        'today_entries': today_entries
    })

@login_required
def delete_entry(request, entry_id):
    """Delete a time entry"""
    try:
        entry = TimeEntry.objects.get(id=entry_id, user=request.user)
        entry.delete()
        messages.success(request, 'Entry deleted successfully!')
    except TimeEntry.DoesNotExist:
        messages.error(request, 'Entry not found.')
    return redirect('data_entry')