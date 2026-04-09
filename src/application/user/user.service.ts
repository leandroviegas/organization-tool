import { AbstractService } from "@/domain/shared/abstract.service";
import { PaginationType } from "@/interfaces/http/schemas/pagination";
import { Prisma } from "@prisma/client";
import { Transactional } from "@/interfaces/http/decorators/transactional";

export class UserService extends AbstractService {
  async findAll(pagination: PaginationType) {
    const { search, page = 1, perPage = 20 } = pagination;

    let where: Prisma.UserWhereInput = {};

    if (search) {
      where = {
        ...where,
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { username: { contains: search } },
        ]
      }
    }

    const [users, meta] = await this.prisma.user.paginate({
      where,
      orderBy: { createdAt: 'desc' },
    }).withPages({
      limit: perPage,
      page: page,
      includePageCount: true,
    });

    return { users, meta };
  }

  findById(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
    });
  }

  @Transactional()
  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        username: data.username,
        image: data.image,
      },
    });
  }

  @Transactional()
  async update(id: string, data: Prisma.UserUpdateInput) {
    await this.findById(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        username: data.username,
        image: data.image,
      },
    });
  }

  @Transactional()
  async delete(id: string) {
    await this.findById(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
