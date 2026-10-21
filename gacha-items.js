// ガチャの図鑑データ。
// 各アイテムは "Fluent Emoji のフォルダ名|日本語の名前|レア度"。レア度は N / R / SR / SSR / X（シークレット）
// months があるシリーズは、その月のあいだだけガチャに出る（季節限定）
window.GACHA_SERIES = [
  { id: "animal", name: "どうぶつ", items: [
    "Dog face|いぬ|N", "Cat face|ねこ|N", "Mouse face|ねずみ|N", "Hamster|ハムスター|N", "Rabbit face|うさぎ|N",
    "Pig face|ぶた|N", "Cow face|うし|N", "Monkey face|さる|N", "Bear|くま|N", "Frog|かえる|N",
    "Fox|きつね|R", "Panda|パンダ|R", "Koala|コアラ|R", "Tiger face|とら|R", "Lion|ライオン|R",
    "Raccoon|アライグマ|R", "Hedgehog|ハリネズミ|R", "Sloth|ナマケモノ|SR", "Otter|カワウソ|SR",
    "Elephant|ゾウ|N", "Giraffe|キリン|R", "Zebra|シマウマ|N", "Kangaroo|カンガルー|SR", "Unicorn|ユニコーン|SSR",
  ]},
  { id: "sea", name: "うみのいきもの", items: [
    "Fish|さかな|N", "Tropical fish|ねったいぎょ|N", "Blowfish|ふぐ|N", "Crab|かに|N", "Shrimp|えび|N",
    "Octopus|たこ|N", "Squid|いか|N", "Spiral shell|まきがい|N", "Lobster|ロブスター|R", "Oyster|かき|R",
    "Dolphin|イルカ|R", "Seal|アザラシ|R", "Shark|サメ|SR", "Spouting whale|しおふきクジラ|SR",
    "Coral|サンゴ|R", "Jellyfish|クラゲ|SR", "Whale|クジラ|SSR",
  ]},
  { id: "birdbug", name: "とり・むし", items: [
    "Bird|ことり|N", "Baby chick|ひよこ|N", "Chicken|にわとり|N", "Duck|あひる|N", "Penguin|ペンギン|N",
    "Owl|ふくろう|R", "Eagle|わし|R", "Parrot|オウム|R", "Swan|はくちょう|R", "Flamingo|フラミンゴ|SR",
    "Peacock|クジャク|SR", "Dodo|ドードー|SSR", "Honeybee|ミツバチ|N", "Lady beetle|てんとうむし|N",
    "Snail|かたつむり|N", "Ant|あり|N", "Beetle|カブトムシ|R", "Cricket|コオロギ|R",
  ]},
  { id: "fruit", name: "くだもの", items: [
    "Red apple|りんご|N", "Green apple|あおりんご|N", "Pear|洋なし|N", "Tangerine|みかん|N", "Lemon|レモン|N",
    "Banana|バナナ|N", "Grapes|ぶどう|N", "Strawberry|いちご|N", "Cherries|さくらんぼ|N", "Peach|もも|R",
    "Melon|メロン|R", "Pineapple|パイナップル|R", "Mango|マンゴー|R", "Kiwi fruit|キウイ|N",
    "Coconut|ココナッツ|R", "Blueberries|ブルーベリー|SR", "Avocado|アボカド|R",
  ]},
  { id: "veg", name: "やさい", items: [
    "Tomato|トマト|N", "Carrot|にんじん|N", "Potato|じゃがいも|N", "Onion|たまねぎ|N", "Garlic|にんにく|N",
    "Cucumber|きゅうり|N", "Eggplant|なす|N", "Broccoli|ブロッコリー|N", "Ear of corn|とうもろこし|N",
    "Hot pepper|とうがらし|R", "Bell pepper|ピーマン|R", "Leafy green|はっぱ|R", "Olive|オリーブ|R",
    "Peanuts|ピーナッツ|N", "Ginger root|しょうが|SR",
  ]},
  { id: "meal", name: "ごはん", items: [
    "Rice ball|おにぎり|N", "Cooked rice|ごはん|N", "Curry rice|カレー|N", "Steaming bowl|ラーメン|N",
    "Spaghetti|スパゲッティ|N", "Sushi|おすし|R", "Bento box|おべんとう|R", "Fried shrimp|えびフライ|N",
    "Oden|おでん|R", "Dumpling|ぎょうざ|N", "Hamburger|ハンバーガー|N", "French fries|ポテト|N",
    "Pizza|ピザ|N", "Hot dog|ホットドッグ|N", "Sandwich|サンドイッチ|N", "Taco|タコス|R",
    "Burrito|ブリトー|R", "Pancakes|パンケーキ|R", "Waffle|ワッフル|R", "Cooking|めだまやき|N",
    "Bread|食パン|N", "Croissant|クロワッサン|R", "Cheese wedge|チーズ|R", "Meat on bone|マンガ肉|SR",
    "Fondue|フォンデュ|SR", "Takeout box|テイクアウト|R",
  ]},
  { id: "sweets", name: "スイーツ", items: [
    "Doughnut|ドーナツ|N", "Cookie|クッキー|N", "Candy|キャンディ|N", "Lollipop|ペロペロキャンディ|N",
    "Chocolate bar|チョコレート|N", "Soft ice cream|ソフトクリーム|N", "Ice cream|アイス|R",
    "Shortcake|ショートケーキ|R", "Cupcake|カップケーキ|R", "Custard|プリン|R", "Pie|パイ|R",
    "Birthday cake|バースデーケーキ|SR", "Honey pot|はちみつ|R", "Fortune cookie|フォーチュンクッキー|SR",
    "Moon cake|げっぺい|SR",
  ]},
  { id: "drink", name: "のみもの", items: [
    "Hot beverage|ホットコーヒー|N", "Teacup without handle|おちゃ|N", "Glass of milk|ぎゅうにゅう|N",
    "Cup with straw|ジュース|N", "Bubble tea|タピオカ|R", "Beverage box|パックジュース|N",
    "Teapot|ティーポット|R", "Mate|マテ茶|R", "Baby bottle|ほにゅうびん|R", "Ice|こおり|N",
    "Bottle with popping cork|シャンパン|SR", "Clinking glasses|かんぱい|SR",
  ]},
  { id: "vehicle", name: "のりもの", items: [
    "Automobile|くるま|N", "Taxi|タクシー|N", "Bus|バス|N", "Ambulance|きゅうきゅうしゃ|N",
    "Fire engine|しょうぼうしゃ|N", "Police car|パトカー|N", "Delivery truck|トラック|N", "Tractor|トラクター|R",
    "Racing car|レーシングカー|R", "Motor scooter|スクーター|N", "Bicycle|じてんしゃ|N",
    "Kick scooter|キックボード|N", "Skateboard|スケボー|R", "Locomotive|きかんしゃ|R",
    "Bullet train|しんかんせん|R", "Monorail|モノレール|R", "Sailboat|ヨット|N", "Canoe|カヌー|R",
    "Ship|ふね|R", "Airplane|ひこうき|N", "Helicopter|ヘリコプター|R", "Rocket|ロケット|SR",
    "Flying saucer|UFO|SSR", "Aerial tramway|ロープウェイ|SR",
  ]},
  { id: "place", name: "まち・ばしょ", items: [
    "House with garden|おうち|N", "School|がっこう|N", "Hospital|びょういん|N", "Convenience store|コンビニ|N",
    "Hotel|ホテル|N", "Classical building|びじゅつかん|R", "Stadium|スタジアム|R", "Tokyo tower|東京タワー|SR",
    "Japanese castle|おしろ|R", "Castle|せいようのおしろ|SR", "Ferris wheel|かんらんしゃ|R",
    "Roller coaster|ジェットコースター|R", "Carousel horse|メリーゴーラウンド|SR", "Circus tent|サーカス|R",
    "Tent|テント|N", "Camping|キャンプ|N", "Shinto shrine|じんじゃ|R", "Moai|モアイ|SSR",
  ]},
  { id: "nature", name: "しぜん・そら", items: [
    "Sun|たいよう|N", "Cloud|くも|N", "Umbrella with rain drops|あめ|N", "High voltage|かみなり|N",
    "Snow-capped mountain|ゆきやま|R", "Volcano|かざん|R", "Mount fuji|ふじさん|SR", "Water wave|なみ|N",
    "Droplet|しずく|N", "Fire|ほのお|R", "Tornado|たつまき|R", "Crescent moon|みかづき|N", "Star|ほし|N",
    "Glowing star|きらきらぼし|R", "Comet|すいせい|SR", "Ringed planet|どせい|SR", "Milky way|あまのがわ|SSR",
    "Cactus|サボテン|N", "Palm tree|ヤシのき|N", "Evergreen tree|もみのき|N", "Rose|バラ|R", "Hibiscus|ハイビスカス|R",
  ]},
  { id: "sports", name: "スポーツ", items: [
    "Soccer ball|サッカー|N", "Baseball|やきゅう|N", "Basketball|バスケ|N", "Volleyball|バレー|N",
    "Tennis|テニス|N", "Ping pong|たっきゅう|N", "Badminton|バドミントン|N", "American football|アメフト|R",
    "Rugby football|ラグビー|R", "Bowling|ボウリング|R", "Boxing glove|ボクシング|R", "Ice skate|スケート|R",
    "Flag in hole|ゴルフ|R", "Fishing pole|つり|N", "Goal net|ゴール|R", "Trophy|トロフィー|SR",
    "1st place medal|金メダル|SR",
  ]},
  { id: "play", name: "あそび・おんがく", items: [
    "Video game|ゲーム|N", "Joystick|ジョイスティック|R", "Puzzle piece|パズル|N", "Teddy bear|くまのぬいぐるみ|N",
    "Kite|たこあげ|N", "Yo-yo|ヨーヨー|N", "Pool 8 ball|ビリヤード|R", "Bullseye|ダーツ|R",
    "Slot machine|スロット|SR", "Nesting dolls|マトリョーシカ|SR", "Mirror ball|ミラーボール|SR",
    "Guitar|ギター|N", "Musical keyboard|けんばん|N", "Violin|バイオリン|R", "Saxophone|サックス|R",
    "Drum|たいこ|N", "Accordion|アコーディオン|R", "Microphone|マイク|N", "Headphone|ヘッドホン|N",
    "Artist palette|パレット|R",
  ]},
  { id: "item", name: "もちもの", items: [
    "Backpack|リュック|N", "Handbag|ハンドバッグ|N", "Glasses|めがね|N", "Sunglasses|サングラス|N",
    "Billed cap|キャップ|N", "Top hat|シルクハット|R", "Ribbon|リボン|N", "Ring|ゆびわ|SR",
    "Lipstick|くちべに|R", "Closed umbrella|かさ|N", "Key|かぎ|N", "Old key|ふるいかぎ|R",
    "Light bulb|でんきゅう|N", "Candle|ろうそく|N", "Alarm clock|めざましどけい|N", "Hourglass done|すなどけい|R",
    "Camera|カメラ|N", "Laptop|ノートパソコン|N", "Mobile phone|スマホ|N", "Books|ほん|N",
    "Pencil|えんぴつ|N", "Scissors|はさみ|N", "Love letter|ラブレター|R", "Wrapped gift|プレゼント|R",
    "Money bag|おかねぶくろ|SR", "Telescope|ぼうえんきょう|SR",
  ]},
  { id: "face", name: "かお", items: [
    "Grinning face|にっこり|N", "Smiling face with hearts|ラブラブ|N", "Star-struck|めがキラキラ|R",
    "Partying face|パーティー|R", "Smiling face with sunglasses|かっこつけ|N", "Nerd face|ガリベン|N",
    "Face with monocle|かんさつ|R", "Cowboy hat face|カウボーイ|R", "Hot face|あつい|N", "Cold face|さむい|N",
    "Woozy face|ふらふら|N", "Exploding head|あたまドカーン|R", "Pleading face|うるうる|N",
    "Melting face|とけた|SR", "Zany face|へんがお|N", "Hugging face|ぎゅー|N", "Sleeping face|すやすや|N",
    "Clown face|ピエロ|SR", "Grinning cat|ねこにっこり|R", "See-no-evil monkey|みざる|R",
  ]},
  { id: "heart", name: "ハート", items: [
    "Red heart|あかいハート|N", "Orange heart|オレンジのハート|N", "Yellow heart|きいろいハート|N",
    "Green heart|みどりのハート|N", "Blue heart|あおいハート|N", "Purple heart|むらさきのハート|N",
    "Pink heart|ピンクのハート|R", "White heart|しろいハート|R", "Black heart|くろいハート|R",
    "Sparkling heart|キラキラハート|R", "Two hearts|ふたつのハート|N", "Revolving hearts|くるくるハート|R",
    "Heart with ribbon|リボンのハート|SR", "Heart on fire|もえるハート|SR",
  ]},
  { id: "mystery", name: "ふしぎ", items: [
    "Ghost|おばけ|R", "Alien|うちゅうじん|R", "Alien monster|インベーダー|SR", "Robot|ロボット|R",
    "Skull|ドクロ|R", "Ogre|おに|SR", "Goblin|てんぐ|SR", "Crystal ball|すいしょうだま|SR",
    "Magic wand|まほうのつえ|SSR", "Dragon|ドラゴン|SSR", "T-Rex|ティラノサウルス|SSR", "Sauropod|くびながりゅう|SR",
  ]},

  // ---- 季節限定（その季節だけ出る）----
  { id: "spring", name: "🌸 春の限定", months: [3, 4, 5], items: [
    "Cherry blossom|さくら|N", "Tulip|チューリップ|N", "Blossom|はな|N", "Seedling|ふたば|N",
    "Four leaf clover|よつばのクローバー|SR", "Dango|だんご|R", "Japanese dolls|ひなにんぎょう|SR",
    "Carp streamer|こいのぼり|SR", "Bouquet|はなたば|R", "Hatching chick|うまれたひよこ|R", "Butterfly|ちょうちょ|R",
  ]},
  { id: "summer", name: "🌻 夏の限定", months: [6, 7, 8], items: [
    "Sunflower|ひまわり|N", "Watermelon|すいか|N", "Shaved ice|かきごおり|N", "Fireworks|はなび|SR",
    "Sparkler|せんこうはなび|R", "Wind chime|ふうりん|R", "Beach with umbrella|ビーチ|R",
    "Tropical drink|トロピカルドリンク|R", "Tanabata tree|たなばた|SR", "Desert island|むじんとう|SSR",
  ]},
  { id: "autumn", name: "🍁 秋の限定", months: [9, 10, 11], items: [
    "Maple leaf|もみじ|N", "Fallen leaf|おちば|N", "Chestnut|くり|N", "Roasted sweet potato|やきいも|R",
    "Mushroom|きのこ|R", "Moon viewing ceremony|おつきみ|SR", "Jack-o-lantern|ジャック・オー・ランタン|SR",
    "Leaf fluttering in wind|かぜとはっぱ|R", "Rice cracker|おせんべい|N", "Spider web|くものす|SSR",
  ]},
  { id: "winter", name: "⛄ 冬の限定", months: [12, 1, 2], items: [
    "Snowman|ゆきだるま|N", "Snowflake|ゆきのけっしょう|N", "Christmas tree|クリスマスツリー|SR",
    "Pine decoration|かどまつ|SR", "Red envelope|おとしだま|R", "Gloves|てぶくろ|N", "Scarf|マフラー|N",
    "Skis|スキー|R", "Sled|そり|R", "Ice hockey|アイスホッケー|R", "Bell|クリスマスベル|SSR",
  ]},

  // ---- シークレット（0.2%。図鑑でも出るまで ❓）----
  { id: "secret", name: "❓ シークレット", items: [
    "Crown|おうかん|X", "Gem stone|ほうせき|X", "Rainbow|にじ|X", "Shooting star|ながれぼし|X",
    "Dragon face|りゅうのかお|X", "Wing|てんしのつばさ|X",
  ]},
];
