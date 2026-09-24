import { AppError } from "../../shared/errors/AppError";
import { AssetsRepository } from "./assets.repository";
import { CreateAssetDTO, UpdateAssetDTO } from "./assets.types";

export class AssetsService {
    private assetsRepository: AssetsRepository;

    constructor() {
        this.assetsRepository = new AssetsRepository();
    }

    async list() {
        return this.assetsRepository.findAll();
    }

    async findById(id: string) {
        const asset = await this.assetsRepository.findById(id);
        if (!asset) {
            throw new AppError("Ativo não encontrado", 404);
        }
        return asset;
    }

    async create(data: CreateAssetDTO) {
        const existingAsset = await this.assetsRepository.findByTicker(data.ticker);
        if (existingAsset) {
            throw new AppError("Já existe um ativo cadastrado com este ticker", 400);
        }

        return this.assetsRepository.create(data);
    }

    async update(id: string, data: UpdateAssetDTO) {
        const asset = await this.assetsRepository.update(id, data);
        if (!asset) {
            throw new AppError("Ativo não encontrado", 404);
        }
        return asset;
    }

    async delete(id: string): Promise<void> {
        const asset = await this.assetsRepository.findById(id);

        if (!asset) {
            throw new AppError("Ativo não encontrado", 404);
        }

        const deleted = await this.assetsRepository.delete(id);

        if (!deleted) {
            throw new AppError(
                "Não foi possível excluir o ativo. Verifique se existem posições vinculadas a ele.",
                400,
            );
        }
    }
}