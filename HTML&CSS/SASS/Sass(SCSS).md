# Sass(SCSS)
* https://heropy.blog/2018/01/31/sass/

## SCSS Syntax
* **SCSS 문법만 적었습니다~**

### Comment
* Sass와 SCSS의 주석 방법은 다름
* SCSS
```scss
// 컴파일 되지 않는 주석
/* 컴파일 되는 주석 */
/* 컴파일 
되는 여러
줄
주석
*/
```
* Sass
	* 여러 줄 주석을 사용할 때 각 줄 앞에 `*`을 붙이고, 라인을 맞춰야 함
```sass
/* 컴파일
 * 되는
 * 여러줄 주석 */

// Error
/* 에러나는
	* 주석 */
```

### Data Types
* Number: 숫자 - `1`, `.82`, `20px` ...
	* 단위가 있을수도 있다
* String: 문자 - `bold`, `relative`, `"./img/logo.png"` ...
	* 문자에 따옴표가 있을수도 있다
* Colors: 색상 표현 - `red`, `blue`, `#FFFF00`, `rgba(255,255,0,.5)` ...
* Booleans: 논리 - `true`, `false`
* Nulls: 아무것도 없음 - `null`
	* `null`이 사용되면 컴파일하지 않음(속성을 사용하지 않음)
* Lists: 공백이나 `,`로 구분된 값의 목록 - `(apple, banana, orange)`, `apple orange` ...
	* Javascript 배열과 유사
	* `()`는 필수가 아님
* Maps: Lists와 유사하나 값이 `Key: Value` 형태 - `(a: 1, b: 2, c: 3)` ...
	* Javascript 객체와 유사
	* `()`필수

### Nesting(중첩)
* 상위 선택자의 반복을 피하고 편리하게 복잡한 구조 작성 가능
```scss
.section {
	width: 100px;
	.list {
		padding: 10px;
		li {
			float: left;
		}
	}
}
```
Compile to:
```css
.section{
	width: 100px;
}
.section .list {
	padding: 10px;
}
.section .list li {
	float: left;
}
```

#### Ampersand(상위 선택자 참조)
* 중첩 안에서 `&`키워드는 부모 선택자를 참조하여 **치환**
```scss
.btn {
	position: absolute;
	// & = .btn
	&.active {
		color: red
	}
}

.list {
	li {
		// & = li
		&:last-child {
			margin-right: 0;
		}
	}
}

.fs {
	// .fs-small
	&-small {
		font-size: 14px;
	}
	// .fs-medium
	&-medium {
		font-size: 16px;
	}
	// .fs-large
	&-large {
		font-size: 18px;
	}
}
```

#### @at-root(중첩 벗어나기)
* 중첩에서 벗어나고 싶을 때 `@at-root`키워드 사용
* **최상위로 올라감**
* <ins>중첩 안에서 생성하되 중첩 밖에서 사용해야 하는 경우에 유용</ins>
	* ex) 변수의 스코프(중괄호) 상 중첩 안에서 적어야 하는 경우
```scss
.list {
	// variables
	$w: 100px;
	$h: 50px;
	li {
		width: $w;
		height: $h;
	}
	// use variable, out of nesting
	@at-root .box {
		width: $w;
		height: $h;
	}
}
```

#### 중첩된 속성
* `font-`, `margin-`등과 같이 동일한 네임 스페이스를 가지는 속성을 중첩
```scss
.box {
	font: {
		weight: 700; // font-weight
		size: 10px;  // font-size
	}
	margin: {
		top: 10px;    // margin-top
		bottom: 10px; // margin-bottom
	}
}
```

### Variables(변수)
* 반복적으로 사용되는 값을 변수로 지정
* **`$`를 앞에 항상 붙임**
```scss
$변수이름: 값;
```
SCSS
```scss
$color-primary: #FFFF00;
$w: 100px;

.box {
	width: $w;
	background-color: $color-primary;
	border: 1px solid $color-primary;
}
```

#### Varibale Scope(변수 유효범위)
* 변수는 선언된 블록(`{}`)내에서만 사용가능
```scss
.box {
	$color: red;
	background: $color;
}
.item {
	// Error!!
	background: $color;
}
```

#### Variable Reassignment(변수 재할당)
* 변수에 변수 할당 가능
```scss
&red: #FF0000;
$blue: #0000FF;

// Reassignment
$color-primary: $blue;
$color-danger: $red;

.box{
	background: $color-primary;
}
```

#### !global(전역 설정)
* `!global` 플래그를 사용하면 변수의 유효범위를 전역으로 설정
```scss
.box {
	$color: #111 !global; //make variable global
	background: $color;
}
.item {
	// OK
	background: $color;
}
```

* 변수 덮어쓰기
```scss
$color: #000;
.box1 {
	$color: #111 !global;
	background: $color; // #111
}
.box2 {
	background: $color; // #111
}
.box3 {
	$color: #222;
	background: $color; // #222
}
.box4 {
	background: $color; // #111
}
```

#### !default(초깃값 설정)
* `!default`플래그는 할당되지 않은 변수의 초깃값을 설정
* 할당된 변수가 있다면 기존 할당 값을 사용
```scss
$color-primary: red;
.box {
	$color-primary: blue !default;
	background: $color-primary;  // red;
}
```
* <ins>기존 변수가 있을 경우 현재 설정한 값은 사용하지 않겠다는 의미로도 사용</ins>
* 라이브러리를 사용할 때 내가 쓴 변수와 이름이 같으면 값을 덮어버리는 것을 방지
  
Bootstrap 코드 일부: 
```scss
// 사용자의 변수를 덮어쓰는것 방지
$white: #fff !default;
$gray-100: #f8f8fa !default;
$gray-200: #e9ecef !default;
```

#### #{}(문자 보간)
* `#{}`을 이용해서 코드의 어디든지 변수 값을 넣을 수 있다
	* JS 리터럴 템플릿의 {}같은 느낌??
* `#{$변수}`
```scss
$family: unquote("Droid+Sans");  // 문자에서 따옴표 제거(Droid+Sans)
@import url(http://fonts.googleapis.com/css?family=#{$family})
```

### import(가져오기)
* `@import`로 외부에서 가져온 Sass 파일은 모두 단일 CSS 출력 파일로 병합
* 가져온 파일에 정의된 변수나 Mixins 등을 사용 가능
* `@import "경로"`: Sass파일을 가져옴
* **CSS @import 규칙으로 컴파일되는 상황이 있다**
	* 파일 확장자가 .css일 때
	* 파일 이름이 http://로 시작하는 경우
	* url()이 붙었을 경우
	* 미디어쿼리가 있는 경우

#### 여러 파일 가져오기
* 하나의 `@import`로 여러 파일을 가져올 수 있다
* 파일 이름으 `,`로 구분
```scss
// import hedaer.scss, footer.scss
@import "header", "footer"
```

#### 파일 분할(Partials)
* 프로젝트 규모가 커지면 파일을 나눠 유지보수가 쉽도록 함
* 컴파일 시 나눈 파일이 각각 css로 컴파일 되면 성능 이슈 발생
* 그래서 Sass는 Partials 기능 지원
* 파일 이름 앞에 `_`를 붙여 `@import`로 가져오면 css파일로 컴파일하지 않음

> main.scss에는 `_`를 붙이지 않는다

```scss
//main.scss

//hedaer.scss, side-menu.scss
// 두 파일 모두 css로 컴파일 됨(main.css + header.css + side-menu.css)
@import "header", "side-menu"

//_header.scss, _side-munu.scss
// main파일만 css로 컴파일 됨(header, side-menu도 포함된 main.css가 됨)
@import "header", "side-menu"
```

### Operations(연산)
* 산술 연산자
	* `+`: 더하기
	* `-`: 빼기
	* `*`: 곱하기**(하나 이상의 값이 반드시 숫자)**
		- 10px * 10px = Error!
		- 10px * 10 = 100px
	* `/`: 나누기**(오른쪽 값이 반드시 숫자)**
		- 10px / 2px = Error! 
		- 10px / 2 = 5px
	* `%`: 나머지

* 비교 연산자(부등호)
	* Javascript와 동일

* 논리 연산자
	* `and`: 그리고
	* `or`: 또는
	* `not`: 부정

#### 숫자 연산
* 상대적 단위 연산
`px`로 연산을 하지만, 상대적 단위의 경우 `CSS calc()`로 연산해야 함
```scss
width: 50% - 20px; // 단위 모순 에러
width: calc(50% - 20px); // OK
```
* 나누기 연산의 주의사항
CSS 속성값의 숫자를 구분하는 방법으로 `/`를 허용하므로 연산자로 사용되지 않을 수도 있음<br />
SCSS:
```scss
div {
	width: 20px + 20px;
	height: 40px - 10px;
	font-size: 10px * 2;
	margin: 30px / 2;
}
```
CSS:
```css
div {
	width: 40px;      //OK
	height: 30px;     //OK
	font-size: 20px;  //OK
	margin: 30px / 2  //??????
}
```
* **`/`가 연산자로 사용될 때의 조건**
	* 값  또는 그 일부가 변수에 저장되거나 함수에 의해 반환되는 경우
	* 값이 `()`로 묶여있는 경우
	* 값이 다른 산술 표현식의 일부로 사용되는 경우
```scss
div {
	$x: 100px;
	width: $w / 2;  //OK
	height: (100px / 2);  //OK
	font-size: 1px + 12px / 3px;  //OK
}
```

#### 문자 연산
* 문자 연산에는 `+`가 사용
* 결과는 첫번째 피연산자를 기준으로 한다
* **첫번째 피연산자에 `""`있으면 결과도 있고, 없으면 결과도 없다**
```scss
div::after {
	content: "Hello" + world;  // "Hello world"
	flex-flow: row+ "-reverse" + " " + wrap;  // row-reverse wrap
}
```

#### 색상 연산
* 색상도 연산 가능
* rgba의 경우 alpha channel 값은 같아야한다!
```scss
div {
	color: #123456 + #345678;
	//R: 12 + 34 = 46
	//G: 34 + 56 = 8a
	//B: 56 + 78 = ce
	background: rgba(50,100,150,.5) + rgba(10,20,30,.5);
	// alpha channels must be equal!
	// rgba(60,120,180,.5)
}
```

> Alpha Channel은 연산되지 않는다

* Alpha Channel을 연산하기 위한 색상함수
	* opacify($color-rgba, .3): 30% 더 불투명하게
	* transparentize($color-rgba, .2): 20% 더 투명하게

#### 논리 연산
* `@if` 조건문에서 사용된다
* python에서 쓰듯이 하면 되는 듯..ㅋㅋ

### Mixins(재활용)
* 재사용 할 CSS 선언 그룹을 정의하는 기능
* **선언하기(`@mixin`)와 포함하기(`@include`) 두가지 기억하기!**
* <ins>Javascript 함수 기능</ins>
```scss
@minxin 이름 (매개변수) {}

@include 이름;
@include 이름 (인수);
```
```scss
@mixin size {
	width: 100px;
	height: 100px;
}
.box1 {
	@include size;
}
```

* 매개변수 가능
```scss
@mixin size($w, $h) {
  width: $w;
  height: $h;
}

.box1 {
  @include size(100px, 100px);
}
.box2 {
  @include size(150px, 100px);
}
.box3 {
  @include size(150px, 150px);
}
```

* 기본값 정의 가능
```scss
@mixin size($w: 100px, $h: 300px) {
  width: $w;
  height: $h;
}

.box1 {
  @include size; //width: 100px, height: 300px
}
.box2 {
  @include size(150px); //width: 150px, height: 300px
}
.box3 {
  @include size($h: 100px); //width: 100px, height: 100px
}
```

* **`mixin`은 선택자 포함 가능하고 `&`도 가능하다!**
	* `&` 사용시 누굴 가리키는지 주의해서 사용!
```scss
@mixin large-text {
	font: {
		size: 22px;
		weight: 700;
		family: sans-serif;
	}
	color: orange;

	&::after {
		content: "!!";
	}

	span.icon {
		background: url("/img/icon.png");
	}
}

.box {
	@include large-text;  // & = box
}
```

#### Arguments(인수)
* Mixin은 함수처럼 인수를 가질 수 있다
* Argument: 인수(함수 사용식에서 사용`@include`)
* Parameter: 매개변수(함수 선언식에서 사용`@mixin`)

#### 인수의 기본값 설정
* **인수는 기본값을 가질 수 있다**
```scss
@mixin 믹스인이름($variable: default-value){
	style;
}
```

#### Keyword Arguments(키워드 인수)
* 인수를 명시적으로 키워드를 입력하여 작성 가능
* <ins>앞에 인수를 건너띄는 경우에 많이 사용</ins>
* **단, 작성하지 않은 인수가 기본값을 가지도록 설정해 주는 것이 좋다**
```scss
@mixin size($w: 100px, $h: 300px) {
  width: $w;
  height: $h;
}

.box1 {
  @include size($h: 100px); //width: 100px, height: 100px
}
```

#### Variable Arguments(가변 인수)
* 입력할 인수의 개수가 불확실한 경우에 사용
* **매개변수나 인수 뒤에 `...`을 붙인다**
```scss
@mixin minxin-name($param...) {
	style;
}

@inclue minxin-name(arg1, arg2, arg3);
```
* 매개변수에 `...`사용
```scss
@mixin var($w, $h, $bg...) {
  width: $w;
  height: $h;
  background: $bg;
}

.box {
  @include var(
    100px,
    150px,
    url("image/a.png") no-repeat 10px 20px,
    url("image/b.png") no-repeat
  );
}
```
* 인수에 `...`사용
```scss
@mixin font(
	$style: normal,
	$weight: normal,
	$size: 16px,
	$family: sans-serif
) {
	font: {
		style: $style;
		weight: $weight;
		size: $size;
		family: $family;
  	}
}
div {
	// 매개변수 순서와 개수에 맞게 전달
	$font-values: italic, bold, 16px, sans-serif; //Lists Data
	@include font($font-values...);
}
span {
	// 필요한 값만 키워드 인수로 변수에 담아 전달
	$font-values: (style: italic, size: 22px);  // Maps Data
	@include font($font-values...);
}
```

#### @content
* 선언된 mixin에 `@content`가 포함되어 있다면 해당 부분에 원하는 **스타일블록** 전달 가능
* 기존 mixin에 선택자나 속성 추가 가능
```scss
@mixin mixin-name() {
	style;
	@content;
}

@include mixin-name() {
	style; //@content
}
```
SCSS
```scss
@mixin icon($url) {
	&::after {
		content: $url;
		@content;
	}
}

.box {
	@include icon("img/icon.png") {
	    display: block;
	    position: absolute;
	    width: 100px;
	    height: 100px;
	};
}
```

### Extend(확장)
* 특성 선택자아 다른 선태자의 모든 스타일을 가져야 하는 경우에 사용
* `@extend 선택자`
SCSS
```scss
.btn {
	padding: 10px;
	margin: 10px;
	background: blue;
}
.btn-danger {
	@extend .btn;
	background: red;
}
```
CSS
```css
.btn, .btn-danger {
  padding: 10px;
  margin: 20px;
  background: blue;
}

.btn-danger {
  background: red;
}
```
`,`로 구분하는 다중 선택자가 만들어짐(주의!!)
	* 내 현재 선택자(`.btn-danger`)가 어디에 첨부될 것인지
		* <ins>중첩이 있으면 상위 요소 선택자들도 모두 불러오므로 주의!!</ins>
	* 원치 않는 부작용이 초래 될 수 있는지
	* 이 한번의 확장으로 얼마나 큰 CSS가 생성되는지

> `@extend`는 **부작용**이 초래될 수 있으니 **`@mixin` 사용을 권장한다**

### Function(함수)
* 자신의 함수를 정의하여 사용할 수 있다
* Mixin과 함수는 유사하지만 반환되는 내용이 다르다
* **`@return`지시어를 통해 값을 반환한다**
* **`@include` 같은 지시어 없이 사용하기 때문에 작성한 함수와 내장함수의 이름이 충돌 할 수 있다**
	* ex) `red()`라는 내장함수가 있는대 같은 이름으로 함수를 만들면 충돌!!
	* 작성한 함수에는 `extract-`나, `my-custom-function-` 접두어를 붙여도 좋다
		* `extract-red()`
		* `my-custom-function-red()`
	* 내장 함수가 매우 많아 기억하기 어려움
```scss
//mixin
@mixin name($param) {
	style;
}

//function
@function 함수이름($매개변수) {
	@return 값
}
```
* 사용법
```scss
//mixin
@include mixin-name(arg);

//function, ()는 인수가 없어도 필수!!
function-name(arg);
```

* <ins>`@mixin`처럼 기본값, 키워드 인수 등이 사용 가능</ins>
```
@function columns($number: 1, $columns: 12, $width: 1200px) {
  @return $width * ($number / $columns);
}

.container{
	$width: 1200px;
	width: $width;
	.item:nth-child(1){
		width: columns(1);
	}
	.item:nth-child(2){
    	width: columns(8);
	}
	.item:nth-child(3){
		width: columns($width: $width);
	}
}
```

### 조건과 반복
#### if (함수)
* 조건의 값에 따라 두개의 표현식 중 하나만 반환
* **JS의 삼항연산자와 유사**
```scss
// true면 표현식1, false면 표현식2
if(조건, 표현식1, 표현식2)
```

#### @if (지시어)
* 조건에 따른 분기 처리 가능
* **JS의 if문과 유사**
* `@else`, `@else if` 사용 가능
* <ins>조건에 `()`는 생략할 수 있다 - 편리함</ins>
```scss
$bg: true;
div {
	@if bg {
		background: orange;
	}
}
```

### @for
* 스타일을 반복적으로 출력
* **JS for문과 유사**
* **`through`를 사용하는 형식과 `to`를 사용하는 형식으로 나뉜다**
```scss
// through
// 종료만큼 반복
@for $변수 from 시작 through 종료 {
	// 반복내용
}

// to
// 종료 직전까지 반복
@for $변수 from 시작 to 종료 {
	// 반복내용
}
```

> 변수는 관례상 `$i`, `$index`를 사용한다

```scss
// 1부터 3번 반복
@for $i from 1 through 3 {
	.item:nth-child(#{$i}) {
		width: 20px * $i
	}
}

// 6부터 10직전까지 반복(6, 7, 8, 9)
// 프로그래밍 언어에서 쓰는 반복문 개념과 유사
@for $i from 6 to 10 {
	.item:nth-child(#{$i}) {
		width: 20px * $i
	}
}
```

### @each
* List와 Map 데이터를 반복할 때 사용
* **JS for of 문과 유사**
```scss
@each $변수 in $ListData(MapData) {
	// 반복 내용
}
```
* List Data 사용 예제
```scss
$fruits: (apple, orange, banana, mango); // List Data

.fruits {
	@each $fruit in $fruits {
		// built-in function finds element's index
		$index: index($fruits, $fruit);
		li:nth-child(#{$index}) {
			left: 50px * $index;
			background: url("img/#{$fruit}.png");
		}
	}
}
```

* Map Data 사용 예제
```scss
$fruits: (
	apple: red,
	orange: orange,
	banana: yellow,
);

// $key, $value
@each $fruit, $color in $fruits {
	// map-keys($fruits) -> (apple, orange, banana)
	// map-values($fruits) -> (red, orange, yellow)
	$fruits-data-key-list: map-keys($fruits);
	$index: index($fruits-data-key-list, $fruit);
	.box-#{$fruit} {
		width: 100px * $index;
    	background: $color;
	}
}
```

### @while
* `@while`의 조건이 `false`로 평가될 때까지 내용 반복
* **JS의 while문과 유사**
* <ins>무한루프에 빠질 수도 있음! **사용 권장하지 않음**</ins>
```scss
@while 조건 {
	// 반복 내용
}
```

> 조건이 명확하지 않을 때에는 `@for`, `@each`를 사용하자!!

### Built-in Functions (내장 함수)
* https://sass-lang.com/documentation/modules 에서 모든 내장함수 확인 가능
* `[]`는 선택 가능한 인수(argument)
* **Zero-base numbering을 사용하지 않음**
* 외우려고 하지 말자
* 이런 기능을 가진 함수가 있었는대..하면서 구글링하면 나온다