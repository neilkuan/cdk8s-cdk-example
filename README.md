# cdk8s-cdk-example


## How to use ?!
```bash
#To synth 
cdk synth -c domain=replace.your.domain

#To Diff
cdk diff -c domain=replace.your.domain

#To Deploy
cdk deploy --require-approval never -c domain=replace.your.domain 

#To Destroy
cdk destroy -f
```

## For test Alb Loadbalancer Controller and External DNS you can 
```bash
# before that you can replace your domain in 2048/2048-4-ingress.yaml line 9
# external-dns.alpha.kubernetes.io/hostname: replace.your.domain <- replace to your domain name you want
kubectl apply -f 2048/ 
```