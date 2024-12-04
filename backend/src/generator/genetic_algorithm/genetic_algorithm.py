import asyncio
import random

import torch
import torch.nn as nn
from tqdm import tqdm
from transformers import PreTrainedTokenizerFast


class FastGeneticAlgorithm:
    def __init__(
        self,
        model: nn.Module,
        scaler_mean: float,
        scaler_scale: float,
        tokenizer: PreTrainedTokenizerFast,
        tokenize_kwargs: dict,
        dataloader_kwargs: dict,
    ) -> None:
        """
        Args:
            model (nn.Module): Prediction model used for fitness calculation.
            scaler_mean (float): The mean value used for scaling the target value.
            scaler_scale (float): The scale factor used for normalizing the target value.
            tokenizer (PreTrainedTokenizerFast): The tokenizer used for encoding and decoding sequences.
            tokenize_kwargs (dict): Keyword arguments passed to the tokenizer during tokenization.
            dataloader_kwargs (dict): Keyword arguments passed to the DataLoader for managing batches of data.
        """
        self.model = model
        self.scaler_mean = scaler_mean
        self.scaler_scale = scaler_scale
        self.tokenizer = tokenizer
        self.dataloader_kwargs = dataloader_kwargs

        tokenize_kwargs['return_tensors'] = 'pt'
        self.tokenize_kwargs = tokenize_kwargs

        self.nucleotide_ids_tensor = torch.tensor(
            [
                self.tokenizer.vocab['A'],
                self.tokenizer.vocab['T'],
                self.tokenizer.vocab['G'],
                self.tokenizer.vocab['C'],
            ]
        )

    @torch.inference_mode()
    def run_sync(
        self,
        target_value: float,
        population_size: int,
        mutation_rate: float,
        num_iterations: int,
        init_base_sequences: list[str],
    ) -> tuple[list[str], list[float]]:
        """Iteratively optimize sequences using a genetic algorithm.

        To improve speed, the implementation directly handles input_ids.

        Args:
            target_value (float): The optimal value that the genetic algorithm should converge to.
            population_size (int): The number of sequences in the population.
            mutation_rate (float): The probability of mutation occurring at each nucleotide position.
            num_iterations (int): The number of iterations to run the genetic algorithm.
            init_base_sequences (list[str]): The initial sequences from which the population is generated.

        Returns:
            tuple[list[str], list[float]]:
                - A list of optimized sequences after the genetic algorithm has run.
                - A list of corresponding rescaled predictions from the model.
        """
        assert 0 <= mutation_rate <= 1, 'Mutation rate must be between 0 and 1'

        scaled_target_value = (target_value - self.scaler_mean) / self.scaler_scale

        # Initialisation
        init_sequences = random.choices(init_base_sequences, k=population_size)
        encoded = self.tokenizer(init_sequences, **self.tokenize_kwargs)
        input_ids = encoded['input_ids']
        attention_mask = encoded['attention_mask'].bool()

        for _ in tqdm(range(num_iterations)):
            # Mutation
            mutation_mask = torch.rand(input_ids.shape) < mutation_rate
            applied_mask = attention_mask & mutation_mask

            random_nucleotides = torch.randint(0, len(self.nucleotide_ids_tensor), size=input_ids.shape)
            random_nucleotide_ids = self.nucleotide_ids_tensor[random_nucleotides]

            input_ids[applied_mask] = random_nucleotide_ids[applied_mask]

            # Fitness calculation
            predictions = self.model(input_ids)
            error = torch.abs(predictions - scaled_target_value)
            fitnesses = 1 / (1 + error)

            # Selection
            probs = fitnesses / fitnesses.sum()
            selected_indices = torch.multinomial(probs, num_samples=population_size, replacement=True)
            input_ids = input_ids[selected_indices]

        # Post-processing
        predictions = self.model(input_ids)
        rescaled_predictions = (predictions * self.scaler_scale + self.scaler_mean).tolist()
        sequences = self.tokenizer.batch_decode(input_ids, skip_special_tokens=True)
        sequences = [seq.replace(' ', '') for seq in sequences]

        error = torch.abs(predictions - scaled_target_value)
        fitnesses = (1 / (1 + error)).tolist()
        sorted_results = sorted(
            zip(sequences, rescaled_predictions, fitnesses, strict=False), key=lambda x: x[2], reverse=True
        )
        sequences, rescaled_predictions, _ = map(list, zip(*sorted_results, strict=False))

        return sequences, rescaled_predictions

    @torch.inference_mode()
    async def run_async(
        self,
        target_value: float,
        population_size: int,
        mutation_rate: float,
        num_iterations: int,
        init_base_sequences: list[str],
    ) -> tuple[list[str], list[float]]:
        """Async version of run_sync method."""
        assert 0 <= mutation_rate <= 1, 'Mutation rate must be between 0 and 1'

        scaled_target_value = (target_value - self.scaler_mean) / self.scaler_scale

        # Initialization
        init_sequences = random.choices(init_base_sequences, k=population_size)
        encoded = self.tokenizer(init_sequences, **self.tokenize_kwargs)
        input_ids = encoded['input_ids']
        attention_mask = encoded['attention_mask'].bool()

        for _ in tqdm(range(num_iterations)):
            await asyncio.sleep(0)

            # Mutation
            mutation_mask = torch.rand(input_ids.shape) < mutation_rate
            applied_mask = attention_mask & mutation_mask

            random_nucleotides = torch.randint(0, len(self.nucleotide_ids_tensor), size=input_ids.shape)
            random_nucleotide_ids = self.nucleotide_ids_tensor[random_nucleotides]

            input_ids[applied_mask] = random_nucleotide_ids[applied_mask]

            # Fitness calculation
            predictions = self.model(input_ids)
            error = torch.abs(predictions - scaled_target_value)
            fitnesses = 1 / (1 + error)

            # Selection
            probs = fitnesses / fitnesses.sum()
            selected_indices = torch.multinomial(probs, num_samples=population_size, replacement=True)
            input_ids = input_ids[selected_indices]

        # Post-processing
        predictions = self.model(input_ids)
        rescaled_predictions = (predictions * self.scaler_scale + self.scaler_mean).tolist()
        sequences = self.tokenizer.batch_decode(input_ids, skip_special_tokens=True)
        sequences = [seq.replace(' ', '') for seq in sequences]

        error = torch.abs(predictions - scaled_target_value)
        fitnesses = (1 / (1 + error)).tolist()
        sorted_results = sorted(
            zip(sequences, rescaled_predictions, fitnesses, strict=False), key=lambda x: x[2], reverse=True
        )
        sequences, rescaled_predictions, _ = map(list, zip(*sorted_results, strict=False))

        return sequences, rescaled_predictions
