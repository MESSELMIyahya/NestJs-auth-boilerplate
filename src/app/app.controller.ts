import { Controller, Get, Header, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedUserRequestInterInterface } from './modules/auth/interfaces/authenticated-user-request.interface';
import { AuthGuard } from './modules/auth/guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // this is protected route
  @Get('/profile')
  @Header('content-type', 'text/html')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: AuthenticatedUserRequestInterInterface) {
    return `<h3 style="font-family:system-ui">Hello <span style="color:lightblue;">${req.user.username.toLocaleUpperCase()}</span>, your email is <span style="color:lightblue;">${req.user.email}</span></h3>`;
  }
}
