import { Stage } from './stage.models';
import { asStage } from './stage.util';

function exceptStage(stage: Stage, ...values: string[]) {
  values.forEach(value => expect(stage).toEqual(asStage(value)));
}

describe('Stage Util Spec', () => {

  it('Should return stage "develop"', () => {
    exceptStage(Stage.Develop, 'develop', 'dEvElop', 'DEVELOP');
  });

  it('Should return stage "test"', () => {
    exceptStage(Stage.Test, 'test', 'tESt', 'TEST');
  });


  it('Should return stage "int"', () => {
    exceptStage(Stage.Int, 'int', 'iNT', 'INT');
  });


  it('Should return stage "prod"', () => {
    exceptStage(Stage.Prod, 'prod', 'pROd', 'PROD');
  });
});
