import asyncio
import random

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from tqdm import tqdm
from transformers import PreTrainedTokenizerFast


class FastGeneticAlgorithm:
    def __init__(  # type: ignore[no-any-unimported]
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
        self.tokenize_kwargs = tokenize_kwargs
        self.dataloader_kwargs = dataloader_kwargs

        self.nucleotide_ids = [
            self.tokenizer.vocab['A'],
            self.tokenizer.vocab['T'],
            self.tokenizer.vocab['G'],
            self.tokenizer.vocab['C'],
        ]

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

        # Initialization
        init_sequences = random.choices(init_base_sequences, k=population_size)
        input_ids = self.tokenizer(init_sequences, **self.tokenize_kwargs)['input_ids']
        dataloader = DataLoader(TensorDataset(torch.tensor(input_ids)), **self.dataloader_kwargs)

        for _ in tqdm(range(num_iterations)):
            all_input_ids = torch.empty(0, dtype=torch.long)
            all_fitnesses = torch.empty(0)
            for batch in dataloader:
                input_ids = batch[0]
                attention_mask = input_ids != self.tokenizer.pad_token_id

                # Mutation
                mutation_mask = torch.rand_like(attention_mask.float()) < mutation_rate
                applied_mask = torch.logical_and(attention_mask, mutation_mask)
                input_ids[applied_mask] = torch.tensor(
                    random.choices(self.nucleotide_ids, k=int(applied_mask.sum().item()))
                )

                # Fitness calculation
                predictions = self.model(input_ids)
                error = torch.abs(predictions - scaled_target_value)
                fitnesses = 1 / (1 + error)

                all_input_ids = torch.cat((all_input_ids, input_ids))
                all_fitnesses = torch.cat((all_fitnesses, fitnesses))

            # Selection
            probs = all_fitnesses / all_fitnesses.sum()
            selected_index = torch.multinomial(probs, num_samples=population_size, replacement=True)
            next_input_ids = all_input_ids[selected_index]

            dataloader = DataLoader(TensorDataset(next_input_ids), **self.dataloader_kwargs)

        # Post-processing
        predictions = self.model(next_input_ids)
        error = torch.abs(predictions - scaled_target_value)
        fitnesses = (1 / (1 + error)).tolist()
        rescaled_predictions = (predictions * self.scaler_scale + self.scaler_mean).tolist()

        sequences = self.tokenizer.batch_decode(next_input_ids, skip_special_tokens=True)
        sequences = [seq.replace(' ', '') for seq in sequences]

        sorted_results = sorted(zip(sequences, rescaled_predictions, fitnesses), key=lambda x: x[2], reverse=True)
        sequences, rescaled_predictions, _ = zip(*sorted_results)

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
        input_ids = self.tokenizer(init_sequences, **self.tokenize_kwargs)['input_ids']
        dataloader = DataLoader(TensorDataset(torch.tensor(input_ids)), **self.dataloader_kwargs)

        for _ in tqdm(range(num_iterations)):
            await asyncio.sleep(0)

            all_input_ids = torch.empty(0, dtype=torch.long)
            all_fitnesses = torch.empty(0)
            for batch in dataloader:
                await asyncio.sleep(0)

                input_ids = batch[0]
                attention_mask = input_ids != self.tokenizer.pad_token_id

                # Mutation
                mutation_mask = torch.rand_like(attention_mask.float()) < mutation_rate
                applied_mask = torch.logical_and(attention_mask, mutation_mask)
                input_ids[applied_mask] = torch.tensor(
                    random.choices(self.nucleotide_ids, k=int(applied_mask.sum().item()))
                )

                # Fitness calculation
                predictions = self.model(input_ids)
                error = torch.abs(predictions - scaled_target_value)
                fitnesses = 1 / (1 + error)

                all_input_ids = torch.cat((all_input_ids, input_ids))
                all_fitnesses = torch.cat((all_fitnesses, fitnesses))

            # Selection
            probs = all_fitnesses / all_fitnesses.sum()
            selected_index = torch.multinomial(probs, num_samples=population_size, replacement=True)
            next_input_ids = all_input_ids[selected_index]

            dataloader = DataLoader(TensorDataset(next_input_ids), **self.dataloader_kwargs)

        # Post-processing
        predictions = self.model(next_input_ids)
        error = torch.abs(predictions - scaled_target_value)
        fitnesses = (1 / (1 + error)).tolist()
        rescaled_predictions = (predictions * self.scaler_scale + self.scaler_mean).tolist()

        sequences = self.tokenizer.batch_decode(next_input_ids, skip_special_tokens=True)
        sequences = [seq.replace(' ', '') for seq in sequences]

        sorted_results = sorted(zip(sequences, rescaled_predictions, fitnesses), key=lambda x: x[2], reverse=True)
        sequences, rescaled_predictions, _ = zip(*sorted_results)

        return sequences, rescaled_predictions
