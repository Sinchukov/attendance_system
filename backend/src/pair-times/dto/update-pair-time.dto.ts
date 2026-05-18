/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePairTimeDto } from './create-pair-time.dto';

export class UpdatePairTimeDto extends PartialType(CreatePairTimeDto) {}
