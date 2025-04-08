import os
import json

def generate_repo_schema(root_dir):
    """
    Recursively generates a schema of the directory structure.
    """
    schema = {}
    for item in os.listdir(root_dir):
        item_path = os.path.join(root_dir, item)
        if os.path.isdir(item_path):
            schema[item] = generate_repo_schema(item_path)  # Recurse into subdirectory
        else:
            schema[item] = None  # Files are leaf nodes
    return schema

def save_schema_to_json(schema, output_file):
    """
    Saves the schema to a JSON file.
    """
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(schema, f, indent=4)

if __name__ == "__main__":
    # Replace '.' with the path to your repository root if needed
    repo_root = "."
    output_file = "repo_schema.json"

    # Generate the schema
    schema = generate_repo_schema(repo_root)

    # Save the schema to a JSON file
    save_schema_to_json(schema, output_file)

    print(f"Repository schema saved to {output_file}")