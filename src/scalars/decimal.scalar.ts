import { Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';
import Decimal from 'decimal.js';

@Scalar('Decimal')
export class DecimalScalar {
  description = 'Decimal custom scalar type';

  parseValue(value: string): Decimal {
    return new Decimal(value);
  }

  serialize(value: Decimal): string {
    return value.toString();
  }

  parseLiteral(ast: any): Decimal {
    if (ast.kind === Kind.STRING) {
      return new Decimal(ast.value);
    }
    return null;
  }
}
