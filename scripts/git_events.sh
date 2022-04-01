#! /usr/bin/bash
runenv=$(pwd)
git_origin=$(git remote show -n)
git_address=$(git remote get-url $git_origin)
git_name=${git_address[0]##*/}
pro_name=${git_name%.*}
org_branch="builder"
new_branch="$org_branch-$1"
tag_dir=/f/$pro_name/
src_dir=$runenv/builder-dist/*
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

init(){
  create_logs $1
  create_target $1
}

create_logs(){
  rm -rf $runenv/logs
  mkdir -p $runenv/logs
}

# 创建目录，并执行初始化操作
create_target(){
  cd f:
  git clone $git_address
  cd $pro_name
}

# 移动文件
mv_files(){
  log "move src: $src_dir"
  log "move tag: $tag_dir"
  cp -rf $src_dir $tag_dir > $err_dir
  rm -rf $src_dir > $err_dir
}

git_pull(){
  # 尝试拉取 builder 分支
  git pull $git_origin $org_branch > $err_dir

  # 如果没有 builder 分支，需要新建并切换到此分支
  if [ $? -eq 1 ];then
    git checkout -b $org_branch > $err_dir

    git pull $git_origin $org_branch > $err_dir

    git push -u $git_origin $org_branch > $err_dir
  fi

  # 切换到需要推送的分支
  git checkout -b $new_branch > $err_dir
  git pull $git_origin $new_branch > $err_dir
}

# 推送
git_push(){
  # cd $tag_dir
  git status
  git add -A
  git commit -m "feat: build new branch $new_branch" > $err_dir
  git push -u $git_origin $new_branch > $err_dir
  rm -rf $tag_dir > $err_dir
}

init $1
git_pull $1
mv_files $1
git_push $1
exit