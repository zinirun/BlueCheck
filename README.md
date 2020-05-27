## BlueCheck
🔨아파트 유지보수 시스템  
Apartment Hot-Fix System

### Requirement
> `git`, `Docker`, `MySQL(or Maria) Database Docker`

### Clone this git
```git clone https://github.com/zinirun.BlueCheck.git```

### Setup your database at your git repository
> Edit makeapp.sh  
```vi makeapp.sh```  
> Edit script at `--link` for running docker container  
```--link YOUR_DB_NAME:db```

### Run shellscript at your git repository
```chmod +x makeapp.sh; ./makeapp.sh```

#### Attach Docker Container
```docker exec -it bc-app```

#### View node logs
```docker logs bc-app```
