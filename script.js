var myForm = document.getElementById("myform");

myForm.addEventListener("submit", function generateStats(e){

var str = document.getElementById("mytextarea").value;

var counters = {
  ccnt:0, //charater count
  wcnt:0, //word count
  scnt:0, //spance count
  pcnt:0, //sentence count
  twcnt:0 //temp word counter.. a sentence is at least 2 words
}

//to control state automation
var flags ={
  flag_start:true,
  flag_char:false,
  flag_space:false,
  flag_sentence:false
}


          for(var c in str)
          {

            if(flags.flag_start){
              //state 1
              state1(str, c, counters, flags);

            }else if(flags.flag_char){
              //state 2
              state2(str, c, counters, flags);


            }else if(flags.flag_space){
              //state 3
              state3(str, c, counters, flags);
            }
            else if(flags.flag_sentence){
              //state 4
              state4(str, c, counters, flags);
            }
          }

      if(flags.flag_char)
      {
        counters.wcnt++; counters.twcnt++;

        if(counters.twcnt>1)counters.pcnt++;
      }

      if(flags.flag_space && counters.twcnt>1)counters.pcnt++;

      if(flags.flag_sentence && counters.twcnt>1)counters.pcnt++;


      var avg_words = counters.pcnt===0?0:(counters.wcnt.toFixed(2)) / (counters.pcnt.toFixed(2));

      document.getElementById("words").innerHTML = counters.wcnt;
      document.getElementById("sentences").innerHTML = counters.pcnt;
      document.getElementById("avg_words").innerHTML = avg_words;
      document.getElementById("spaces").innerHTML = counters.scnt;

      e.preventDefault();

    });


    function state4(str, c, counters, flags)
    {
      if(ignoreChar(str[c]))return;

      if(isSentMark(str[c]))
      {
        return;
      }
      else if(isChar(str[c]))
      {
        flags.flag_char = true;
        flags.flag_space = false;
        flags.flag_sentence = false;
        counters.ccnt++;
      }
      else if(isSpace(str[c]))
      {
        flags.flag_char = false;
        flags.flag_space = true;
        flags.flag_sentence = false;

        counters.twcnt=0;
      }
    }

    function state3(str, c, counters, flags)
    {
      if(ignoreChar(str[c]))return;

      if(isSpace(str[c]))
      {
        //consecutive spaces are considered as one
        return;
      }
      else if(isChar(str[c]))
      {
        flags.flag_char = true;
        flags.flag_space = false;
        flags.flag_sentence = false;

        if(counters.twcnt>0)counters.scnt++;

        counters.ccnt++;
      }
      else if(isSentMark(str[c]))
      {
        flags.flag_char = false;
        flags.flag_space = false;
        flags.flag_sentence = true;

        if(counters.twcnt>1)counters.pcnt++;

        counters.twcnt=0;
      }
    }

    function state2(str, c, counters, flags)
    {
      if(ignoreChar(str[c]))return;

      if(isChar(str[c]))
      {
        counters.ccnt++;
        return;
      }
      else if(isSpace(str[c]))
      {
        flags.flag_char = false;
        flags.flag_space = true;
        flags.flag_sentence = false;

        counters.wcnt++;
        counters.twcnt++;
      }else if(isSentMark(str[c]))
      {
        flags.flag_char = false;
        flags.flag_space = false;
        flags.flag_sentence = true;

        counters.wcnt++;
        counters.twcnt++;

        if(counters.twcnt>1)counters.pcnt++;

        counters.twcnt=0;
      }
    }

    function state1(str, c, counters, flags)
    {
      if(ignoreChar(str[c]))return;

      if(isSpace(str[c]))
      {
        //consecutive spaces at the begining are trimmed
        return;
      }
      else
      {
        flags.flag_start = false;
        flags.flag_char = true;
        flags.flag_space = false;
        flags.flag_sentence = false;

        counters.ccnt++;
      }
    }

    function isSpace(c)
    {
      if(c.length>1)return false;

      return c==' '?true:false;
    }

    //sentence marker
    function isSentMark(c)
    {
      if(c.length>1)return false;

      var regexp = /[!?.]/;
      return regexp.test(c);
    }

    function isChar(c)
    {

      if(c.length>1)return false;

      return (!isSpace(c) && !isSentMark(c))?true:false;

    }

    function ignoreChar(c)
    {
      var regexp =/[\n\r]/;
      return regexp.test(c);
    }
