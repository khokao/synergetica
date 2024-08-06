from datasets import Dataset, load_dataset


def load_dataset_from_csv(  # type: ignore[no-any-unimported]
    csv_path: str,
    sequence_col: str,
    target_col: str,
) -> Dataset:
    """Loads a dataset from a CSV file and selects specific columns.

    Args:
        csv_path (str): The file path to the CSV file to load.
        sequence_col (str): The name of the column containing sequence data.
        target_col (str): The name of the column containing target labels.

    Returns:
        Dataset: A Hugging Face Dataset object containing the specified columns.
    """
    dataset = load_dataset('csv', data_files=csv_path, split='train')
    dataset = dataset.select_columns([sequence_col, target_col])
    return dataset
