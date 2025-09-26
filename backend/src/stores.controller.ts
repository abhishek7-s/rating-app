import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { StoresService } from './stores/stores.service';
import { RatingsService } from './ratings/ratings.service';
import { CreateRatingDto } from './ratings/dto/create-rating.dto'; // You'll need to create this DTO
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly ratingsService: RatingsService,
  ) {}

  @Get()
  async findAllForUser(@Request() req) {
    // This service method needs to be created
    return this.storesService.findAllWithRatingsForUser(req.user.id);
  }

  @Post(':storeId/ratings')
  rateStore(
    @Param('storeId') storeId: string,
    @Request() req,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const userId = req.user.id;
    return this.ratingsService.upsert({
      userId,
      storeId,
      rating: createRatingDto.rating,
    });
  }
}