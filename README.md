# cdk8s-cdk-example


## How to use ?!
```bash
#To synth 
cdk synth -c zoneName=$ZONENAME  -c zoneId=$ZONEID -c acm=$ACMARN

#To Diff
cdk diff -c -c zoneName=$ZONENAME  -c zoneId=$ZONEID -c acm=$ACMARN

#To Deploy
cdk deploy --require-approval never -c zoneName=$ZONENAME  -c zoneId=$ZONEID -c acm=$ACMARN 

#To Destroy
cdk destroy -f
```