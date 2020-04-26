import * as _ from 'lodash';
import { NumberUtil } from '../../common/util';

export class ValidUtil {

  static notNum(s: any): boolean {
    return _.isNil(s) || isNaN(s) || (s * 1 !== s);
  }

  static isPositiv(s: any): boolean {
    return !ValidUtil.notNum(s) && NumberUtil.toInt(s) > 0;
  }
}
