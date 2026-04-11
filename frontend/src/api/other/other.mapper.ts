import type { 
    AddAuthorResponseDto,
    AddPublisherResponseDto
} from "./other.types";

export const mapAddPublisherResponse = (dto: AddPublisherResponseDto): { id: string, publisherName: string } => ({
    id: dto.id,
    publisherName: dto.publisher_name
});

export const mapAddAuthorResponse = (dto: AddAuthorResponseDto): { id: string, authorName: string } => ({
    id: dto.id,
    authorName: dto.author_name
});