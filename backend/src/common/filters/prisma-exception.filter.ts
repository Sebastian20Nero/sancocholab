import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    // defaults
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Error de base de datos';

    // Prisma codes: https://www.prisma.io/docs/orm/reference/error-reference
    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = `Duplicado: ${String((exception.meta as any)?.target ?? '')}`;
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Registro no encontrado';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Referencia inválida (FK)';
        break;
      default:
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
        break;
    }

    res.status(status).json({
      ok: false,
      error: {
        code: exception.code,
        message,
      },
    });
  }
}
