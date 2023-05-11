import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist';
import { Manager } from 'src/entity/manager.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Manager)
    private managerRepository: Repository<Manager>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<Manager> {
    const { manager_id, manager_email, manager_name, manager_password } =
      authCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(manager_password, salt);

    const manager = {
      manager_id,
      manager_email,
      manager_name,
      manager_password: hashedPassword,
    };

    try {
      return await this.managerRepository.save(manager);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('존재하는 매니저이름');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { id, password } = loginDto;
    const manager = await this.managerRepository.findOne({
      where: { manager_id: id },
    });

    if (!manager) {
      throw new NotFoundException(`해당 id의 매니저 없음. id : ${id}`);
    }
    if (manager && (await bcrypt.compare(password, manager.manager_password))) {
      const name = manager.manager_name;
      // 로그인 성공 로직
      const payload = { name };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('비밀번호가 틀림.');
    }
  }
}
