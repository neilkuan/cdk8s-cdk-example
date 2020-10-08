import * as s3 from '@aws-cdk/aws-s3';
import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus';
import * as constructs from 'constructs';

export interface MyChartProps {
  readonly bucket: s3.Bucket;
}

export class MyChart extends cdk8s.Chart {
  constructor(scope: constructs.Construct, id: string, props: MyChartProps) {
    super(scope, id);

    new kplus.Pod(this, 'Pod', {
      spec: {
        containers: [
          new kplus.Container({
            image: 'nginx',
            env: {
              BUCKET_NAME: kplus.EnvValue.fromValue(props.bucket.bucketName),
            },
          }),
        ],
      },
    });
  }
}