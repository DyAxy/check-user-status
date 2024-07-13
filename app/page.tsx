'use client'

import { useEffect, useState } from "react";
import { I18nProvider } from "@react-aria/i18n";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Button, DateValue, Input, RangeCalendar, RangeValue, Textarea } from "@nextui-org/react";
import { filesize } from "filesize";

export default function Home() {
  const [email, setEmail] = useState("")
  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ weeks: 1 }),
    end: today(getLocalTimeZone()),
  })
  const [isLoading, setLoading] = useState(false)
  const [value, setValue] = useState<any[]>()
  const [text, setText] = useState("")
  const convertDate = (date: DateValue) => {
    return Math.floor(new Date(date.toDate('Asia/Hong_Kong')).getTime() / 1000)
  }
  useEffect(() => {
    if (value && Array.isArray(value)) {
      const user = value[0]
      const flow = []
      flow.push('用户：' + value[0].user_id)
      flow.push('上传：' + filesize(value[0].u, { standard: "jedec" }))
      flow.push('下载：' + filesize(value[0].d, { standard: "jedec" }))
      flow.push('总计：' + filesize(value[0].total, { standard: "jedec" }))
      setText(flow.join('\n'))
    }
  }, [value])
  const handleButton = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/chackUserStatus?email=${email}&start_t=${convertDate(date.start)}&end_t=${convertDate(date.end)}`)
      setValue(await res.json())
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <main className="flex h-auto flex-col items-center justify-between p-24 gap-3">
      <Input
        className="w-full"
        type="email" label="Email"
        placeholder="输入一个Email"
        value={email}
        onValueChange={setEmail}
      />
      <div>
        <I18nProvider locale="zh-CN">
          <RangeCalendar
            calendarWidth={1024}
            visibleMonths={3}
            aria-label="Date (Show Month and Year Picker)"
            maxValue={today(getLocalTimeZone())}
            value={date}
            onChange={setDate}
          />
        </I18nProvider>
      </div>
      <Button onPress={handleButton} isLoading={isLoading}>
        查询
      </Button>
      <Textarea value={JSON.stringify(value)} />
      <Textarea value={text} />
    </main>
  );
}
