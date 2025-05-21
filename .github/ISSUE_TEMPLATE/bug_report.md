name: バグ報告
description: 不具合や想定外の動作について報告するためのテンプレート
title: "[bug] "
labels: [bug]
body:
  - type: markdown
    attributes:
      value: |
        ありがとうございます！以下の情報を記入していただけると助かります。

  - type: input
    id: summary
    attributes:
      label: 不具合の概要
      description: どんな問題が発生したのか簡潔に記載してください。
      placeholder: 例: 保存ボタンを押しても保存されない
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: 再現手順
      description: どのような操作で問題が発生するか、できるだけ具体的に書いてください。
      placeholder: |
        1. ○○ページにアクセス  
        2. 「保存」ボタンをクリック  
        3. エラーが表示される
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: 期待される挙動
      description: 本来はどうなるべきだったのか
      placeholder: 例: 正常に保存完了メッセージが表示される
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: 実際の挙動
      description: 実際にはどのような挙動になったのか
      placeholder: 例: 「エラーが発生しました」と表示される

  - type: input
    id: env
    attributes:
      label: 使用環境
      description: ブラウザやOS、アプリのバージョンなど
      placeholder: 例: Chrome 124 / iOS 17.4

  - type: textarea
    id: logs
    attributes:
      label: ログ / スクリーンショット（任意）
      description: エラーメッセージや画面キャプチャをここに貼り付けてください