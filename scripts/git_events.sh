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

log(){
  echo "`date "+%Y-%m-%d %H:%M:%S"`: $1" >> $runenv/builder.log
}

err(){
  echo "`date "+%Y-%m-%d %H:%M:%S"`: $1" >> $runenv/builder-error.log
}

# 创建目录，并执行初始化操作
create_target(){
  cd f:
  mkdir -p $pro_name
  cd $pro_name
  git init
}

# 推送
git_push(){
  cd $tag_dir
  git status
  git add -A
  git commit -m "feat: build new branch $new_branch"
  git push -u origin $new_branch
  rm -rf $tag_dir
}

# 移动文件
mv_files(){
  log "move src: $src_dir"
  log "move tag: $tag_dir"
  cp -rf $src_dir $tag_dir
  rm -rf $src_dir
}

git_pull(){
  create_target
  git remote add $git_origin $git_address
  git remote -v
  git pull $git_origin $org_branch
  # pull无异常，就跳过
  if [ $? -eq 1 ];then
    err "$git_address 拉取分支出现异常!"
  fi
  # 先创建 分支
  git checkout -b $new_branch
}

git_pull $1
mv_files $1
git_push $1
exit