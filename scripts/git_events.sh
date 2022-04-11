#! /usr/bin/bash
runenv=$(pwd)
git_origin=$(git remote show -n)
git_address=$(git remote get-url $git_origin)
git_name=${git_address[0]##*/}
pro_name=${git_name%.*}
master="master"
new_branch="builder-$1"
tag_dir=/f/$pro_name/
dst_dir=$runenv/builder-dist/*
log_dir=$runenv/logs/builder.log
err_dir=$runenv/logs/builder-error.log

log(){
  echo "当前盘符: $(pwd)" >> $log_dir
  echo "`date "+%Y-%m-%d %H:%M:%S"`: $1" >> $log_dir
}

err(){
  echo "当前盘符: $(pwd)" > $log_dir
  echo "`date "+%Y-%m-%d %H:%M:%S"`: $1" > $err_dir
}

# 防止在本地切换分支的时候，会出现冲突
kill_workspace_branch(){
  git branch -D $new_branch
}

create_logs(){
  rm -rf $runenv/logs
  mkdir -p $runenv/logs
}

# 创建目录，并执行初始化操作
create_target(){
  cd f:
  if [ -d $pro_name ];then
    rm -rf $pro_name
    if [ $? -eq 1 ];then
      err "git 删除$pro_name失败"
    fi
  fi
  git clone $git_address
  if [ $? -eq 1 ];then
    err "git clone失败"
  fi
  cd $pro_name
}

# 移动文件
mv_files(){
  log "move src: $dst_dir"
  log "move tag: $tag_dir"
  cp -rf $dst_dir $tag_dir
}

git_pull(){
  # 拉取最新 master 分支
  git pull

  git push origin --delete $new_branch

  # 尝试拉取 要更新的分支
  # git pull $git_origin $new_branch

  # 拉取成功，就删除此分支，需要重新建
  # if [ $? -eq 0 ];then
  # fi

  # log "新建builder分支！"
  # git checkout -b $new_branch

  # git pull $git_origin $new_branch

  # git push -u $git_origin $new_branch

  # 切换到需要推送的分支
  git checkout -b $new_branch
  git pull $git_origin $new_branch
}

# 推送
git_push(){
  git status
  git add -A
  git commit -m "feat: build new branch $new_branch"
  if [ $? -eq 1 ];then
    err "git commit失败"
  fi
  git push -u $git_origin $new_branch
  if [ $? -eq 1 ];then
    err "git push失败"
  fi
}

remove_dst(){
  cd $runenv
  rm -rf $dst_dir > $err_dir
  if [ $? -eq 1 ];then
    err "删除$dst_dir失败"
  fi
}

remove_tar(){
  cd f:
  rm -rf $pro_name > $err_dir
  if [ $? -eq 1 ];then
    err "删除$pro_name失败"
  fi
}

kill_workspace_branch $1
create_logs $1
create_target $1
log "创建完毕"
git_pull $1
log "拉取完毕"
mv_files $1
log "资源搬运完毕"
git_push $1
log "推送完毕"
remove_dst $1
remove_tar $1
log "清理完毕"
exit