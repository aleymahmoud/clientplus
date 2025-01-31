from django import forms
from .models import TimeEntry, Client

from django import forms
from .models import TimeEntry, Client

class TimeEntryForm(forms.ModelForm):
    class Meta:
        model = TimeEntry
        fields = ['client', 'hours', 'notes']
        widgets = {
            'client': forms.Select(
                attrs={
                    'class': 'form-select',
                    'required': True,
                }
            ),
            'hours': forms.NumberInput(
                attrs={
                    'class': 'form-control',
                    'step': '0.25',
                    'min': '0',
                    'required': True,
                }
            ),
            'notes': forms.Textarea(
                attrs={
                    'class': 'form-control',
                    'rows': 2,
                    'required': True,
                }
            )
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Explicitly filter only active clients
        self.fields['client'].queryset = Client.objects.filter(St='A').order_by('CLIENTNAME')
        # Add a default empty option
        self.fields['client'].empty_label = "Select a client"

class TimeEntryFormSet(forms.BaseModelFormSet):
    def __init__(self, *args, **kwargs):
        super(TimeEntryFormSet, self).__init__(*args, **kwargs)
        self.queryset = TimeEntry.objects.none()
    