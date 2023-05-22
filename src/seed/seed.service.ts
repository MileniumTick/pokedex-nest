import { AxiosAdapter } from './../common/adapters/axios.adapter';
import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon, PokemonDocument } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=50',
    );

    await this.pokemonModel.deleteMany({});

    const pokemons: { no: number; name: string }[] = data.results.map(
      ({ name, url }) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2];

        return { no, name };
      },
    );

    await this.pokemonModel.insertMany(pokemons);

    return this.pokemonModel.find();
  }
}
