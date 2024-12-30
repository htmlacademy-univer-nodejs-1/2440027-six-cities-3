export interface EntityServiceInterface<EntityType> {
    findById(id: string): Promise<EntityType | null>;
  }
