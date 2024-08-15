def scaler_params_to_dataset_description(mean: float, scale: float) -> str:
    return f'Mean: {mean}, Scale: {scale}'


def dataset_description_to_scaler_params(description: str) -> tuple[float, float]:
    parts = description.split(', ')
    mean = float(parts[0].split(': ')[1])
    scale = float(parts[1].split(': ')[1])

    return mean, scale
