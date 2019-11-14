<template>
  <time :datetime="datetime" :title="localizedTime">{{relativeTime}}</time>
</template>

<script type="text/ecmascript-6">

export default {
  props: ['datetime'],
  computed : {
    localizedTime () {
      return new Date(this.datetime).toLocaleString();
    },
    relativeTime () {
      const date = new Date(this.datetime);
      const delta = (new Date() - date) / 1000;
      if (delta < 60){
        return '刚刚';
      }
      else if (delta < 3600){
        return Math.round(delta / 60) + '分钟前';
      }
      else if (delta < 86400){
        return Math.round(delta / 3600) + '小时前';
      }
      else{
        return (date.getMonth() + 1) + '月' + date.getDate() + '日';
      }
    }
  }
}
</script>
