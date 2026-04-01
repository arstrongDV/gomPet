import os

export_file_name = 'index.ts'
icons_file_name = 'icons.ts'

def camel_case(name):
    words = name.split('-')
    return ''.join([words[0]] + [word.title() for word in words[1:]])

def generate_import_line(file_name):
    camel_name = camel_case(file_name.split('.')[0])
    return f"import {camel_name}Icon from './{file_name}';\n"

def generate_js_object_line(file_name):
    camel_name = camel_case(file_name.split('.')[0])
    return f'  {camel_name}: {camel_name}Icon,\n'

def generate_type_line(file_name):
    camel_name = camel_case(file_name.split('.')[0])
    return f'  | \'{camel_name}\'\n'

def export_ts_files(folder_path):
    export_file_path = os.path.join(folder_path, export_file_name)

    with open(export_file_path, 'w') as export_file:
        export_file.write('/* AUTO-GENERATED FILE */\n\n')

        # Write imports
        for file_name in os.listdir(folder_path):
            if file_name.endswith('.svg'):
                line = generate_import_line(file_name)
                export_file.write(line)

        # Write types
        export_file.write("\nexport type IconNames =\n")
        for file_name in os.listdir(folder_path):
            if file_name.endswith('.svg'):
                line = generate_type_line(file_name)
                export_file.write(line)

        # Write as object
        export_file.write("\n export const Icons = {\n")
        for file_name in os.listdir(folder_path):
            if file_name.endswith('.svg'):
                line = generate_js_object_line(file_name)
                export_file.write(line)

        export_file.write('};')


folder_path = os.path.dirname(os.path.abspath(__file__))
export_ts_files(folder_path)