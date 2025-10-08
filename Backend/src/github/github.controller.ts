import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GithubService } from './github.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { RepoDto } from './dto/repo.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('search')
export class GithubController {
  constructor(private gh: GithubService) {}

  @Get()
  @ApiOkResponse({ type: [RepoDto] })
  search(@Query() q: SearchQueryDto) {
    return this.gh.search(q.query, q.sort, q.ignore);
  }
}
