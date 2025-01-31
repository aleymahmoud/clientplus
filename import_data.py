import os
import sys
import django
import sqlite3
from datetime import datetime

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clientplus.settings')
django.setup()

from myapp.models import Client, HistData, ConsultantDeal, ConsultantVacation, PagePermissions

def import_table(cursor, table_name, model_class, field_mapping):
    try:
        # Get column names from the table
        cursor.execute(f'PRAGMA table_info({table_name})')
        columns = [column[1] for column in cursor.fetchall()]
        
        # Create SELECT query
        query = f'SELECT {", ".join(columns)} FROM {table_name}'
        cursor.execute(query)
        rows = cursor.fetchall()
        
        print(f"\nImporting {len(rows)} records from {table_name}...")
        
        # Clear existing data
        model_class.objects.all().delete()
        
        # Import data
        batch_size = 1000
        objects_to_create = []
        
        for i, row in enumerate(rows, 1):
            # Create a dictionary mapping field names to values
            row_dict = {}
            for col_name, value in zip(columns, row):
                # Map the column name to Django model field name if needed
                django_field = field_mapping.get(col_name, col_name)
                row_dict[django_field] = value

            objects_to_create.append(model_class(**row_dict))
            
            # Batch create every batch_size records
            if len(objects_to_create) >= batch_size:
                model_class.objects.bulk_create(objects_to_create)
                objects_to_create = []
                print(f"Imported {i} records...")

        # Create any remaining objects
        if objects_to_create:
            model_class.objects.bulk_create(objects_to_create)
        
        print(f"Successfully imported {len(rows)} records to {model_class.__name__}")
        return True
        
    except Exception as e:
        print(f"Error importing {table_name}: {str(e)}")
        return False

def import_data():
    if not os.path.exists('FFNT.sqlite'):
        print("Error: FFNT.sqlite file not found in current directory")
        return False

    try:
        # Connect to the old SQLite database
        old_conn = sqlite3.connect('FFNT.sqlite')
        old_cursor = old_conn.cursor()
        
        # Define field mappings (if column names differ from model fields)
        field_mappings = {
            'ClientsData': {},
            'HistData': {},
            'ConsultantDeal': {},
            'ConsultantVacation': {},
            'PagePermissions': {}
        }
        
        # Import each table
        tables_to_import = [
            ('ClientsData', Client, field_mappings['ClientsData']),
            ('HistData', HistData, field_mappings['HistData']),
            ('ConsultantDeal', ConsultantDeal, field_mappings['ConsultantDeal']),
            ('ConsultantVacation', ConsultantVacation, field_mappings['ConsultantVacation']),
            ('PagePermissions', PagePermissions, field_mappings['PagePermissions'])
        ]
        
        success = True
        for table_name, model_class, mapping in tables_to_import:
            if not import_table(old_cursor, table_name, model_class, mapping):
                success = False
                
        old_conn.close()
        
        if success:
            print("\nData import completed successfully!")
        else:
            print("\nData import completed with some errors. Please check the messages above.")
        
        return success
        
    except Exception as e:
        print(f"Critical error during import: {str(e)}")
        return False

if __name__ == '__main__':
    import_data()