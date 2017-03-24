### 获取手机剩余内存

```objective-c
/// 总大小  
float totalsize = 0.0;  
/// 剩余大小  
float freesize = 0.0;  
/// 是否登录  
NSError *error = nil;  
NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);  
NSDictionary *dictionary = [[NSFileManager defaultManager] attributesOfFileSystemForPath:[paths lastObject] error: &error];  
if (dictionary)  
{  
    NSNumber *_free = [dictionary objectForKey:NSFileSystemFreeSize];  
    freesize = [_free unsignedLongLongValue]*1.0/(1024);  
      
    NSNumber *_total = [dictionary objectForKey:NSFileSystemSize];  
    totalsize = [_total unsignedLongLongValue]*1.0/(1024);  
} else  
{  
    NSLog(@"Error Obtaining System Memory Info: Domain = %@, Code = %ld", [error domain], (long)[error code]);  
}
```

