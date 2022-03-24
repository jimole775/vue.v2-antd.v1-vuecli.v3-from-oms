#! /usr/bin/bash
runenv=$(pwd)
git_address=("xxx" "xxx")
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
  i=0
  has_done=0
  create_target
  while [[ $has_done -eq 0 && $i -lt ${#git_address[@]} ]]
  do
    addr=${git_address[$i]}
    git remote add origin $addr
    git remote -v
    git pull origin $org_branch
    # pull无异常，就跳过
    if [ $? -eq 0 ];then
      has_done=1
    else
      err "$addr 出现异常!"
      # 否则, 先删除origin, 再进入下一个循环
      git remote rm origin
      let i++
    fi
  done
  # 先创建 分支
  git checkout -b $new_branch
}

git_pull $1
mv_files $1
git_push $1
exit