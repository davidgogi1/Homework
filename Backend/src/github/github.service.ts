import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { RepoDto } from './dto/repo.dto';

@Injectable()
export class GithubService {
  private ghToken?: string;

  constructor(
    private http: HttpService,
    cfg: ConfigService,
  ) {
    this.ghToken = cfg.get<string>('GITHUB_TOKEN') || undefined;
  }

  async search(
    query: string,
    sort?: 'asc' | 'desc',
    ignore?: string,
  ): Promise<RepoDto[]> {
    if (!query?.trim()) throw new BadRequestException('query is required');

    try {
      const { data } = await firstValueFrom(
        this.http.get('https://api.github.com/search/repositories', {
          params: { q: query, per_page: 30 },
          headers: {
            Accept: 'application/vnd.github+json',
            ...(this.ghToken
              ? { Authorization: `Bearer ${this.ghToken}` }
              : {}),
            'User-Agent': 'github-search-nestjs',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }),
      );

      let items = Array.isArray(data?.items) ? data.items : [];

      if (ignore) {
        const needle = ignore.toLowerCase();
        items = items.filter(
          (r: any) => !r.name?.toLowerCase?.().includes(needle),
        );
      }

      if (sort) {
        items = items.sort((a: any, b: any) => {
          const cmp = String(a.name || '').localeCompare(String(b.name || ''));
          return sort === 'asc' ? cmp : -cmp;
        });
      }

      return items.map((r: any) => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        html_url: r.html_url,
        description: r.description,
        stargazers_count: r.stargazers_count,
        language: r.language,
      }));
    } catch (e: any) {
      throw new InternalServerErrorException(
        e?.response?.data || e?.message || 'GitHub fetch failed',
      );
    }
  }
}
