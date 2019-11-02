import React from 'react';
import {
    Card,
    CardContent,
    CssBaseline,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
    MenuItem,
    Icon,
    Button
} from '@material-ui/core';
import serialize from 'form-serialize';


export default function Top(props) {
    const [value, setValue] = React.useState('');
    const handleChange = event => {
        setValue(event.target.value);
    };
    const submit = event => {
        event.preventDefault();
        window.axios.post('/api/order/create/', serialize(event.target)).then((res)=>{
            props.history.push('/pay/'+res.data);
        }).catch((err)=>{
            if(err.code === 'ECONNABORTED') {
                alert('時間切れです。再度処理を実行してください。');
            } else {
                if(err.response.status===400) {
                    alert(err.response.data.error);
                }
                if(err.response.status===500) {
                    alert('問題が発生しました。管理者にお問い合わせください。');
                }
            }
        });
    };
    function Tshirt() {
        return (
            <Card style={{margin: '2vw'}}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Tシャツのサイズをお答えください。(その他のサイズをご希望の場合はご記入ください)。</FormLabel>
                        <Typography variant="body2" component="p">※参考</Typography>
                        <img src="/img/size.png" style={{width:"100%"}} alt="サイズ表"/>
                        <FormControl component="fieldset">
                            <InputLabel id="ss-size">SSサイズ(155cm-160cm)</InputLabel>
                            <Select labelId="ss-size" name="ss-size">
                                { [0,1,2,3,4,5,6,7,8,9,10].map((i) => <MenuItem value={i} key={i}>{i}</MenuItem>) }
                            </Select>
                        </FormControl>
                        <FormControl component="fieldset">
                            <InputLabel id="s-size">Sサイズ</InputLabel>
                            <Select labelId="s-size" name="s-size">
                                { [0,1,2,3,4,5,6,7,8,9,10].map((i) => <MenuItem value={i} key={i}>{i}</MenuItem>) }
                            </Select>
                        </FormControl>
                        <FormControl component="fieldset">
                            <InputLabel id="m-size">Mサイズ</InputLabel>
                            <Select labelId="m-size" name="m-size">
                                { [0,1,2,3,4,5,6,7,8,9,10].map((i) => <MenuItem value={i} key={i}>{i}</MenuItem>) }
                            </Select>
                        </FormControl>
                        <FormControl component="fieldset">
                            <InputLabel id="l-size">Lサイズ</InputLabel>
                            <Select labelId="l-size" name="l-size">
                                { [0,1,2,3,4,5,6,7,8,9,10].map((i) => <MenuItem value={i} key={i}>{i}</MenuItem>) }
                            </Select>
                        </FormControl>
                        <FormControl component="fieldset">
                            <InputLabel id="ll-size">LLサイズ</InputLabel>
                            <Select labelId="ll-size" name="ll-size">
                                { [0,1,2,3,4,5,6,7,8,9,10].map((i) => <MenuItem value={i} key={i}>{i}</MenuItem>) }
                            </Select>
                        </FormControl>
                        <FormControl component="fieldset">
                            <InputLabel id="3l-size">3Lサイズ</InputLabel>
                            <Select labelId="3l-size" name="3l-size">
                                { [0,1,2,3,4,5,6,7,8,9,10].map((i) => <MenuItem value={i} key={i}>{i}</MenuItem>) }
                            </Select>
                        </FormControl>
                    </FormControl>
                </CardContent>
            </Card>
        );
    }
    function Quest() {
        return (
            <React.Fragment>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">今後、他の種類のTシャツを販売予定です。気になるものがあればお答えください。また、アイデアございましたら、その他にお書きください。</FormLabel>
                            <RadioGroup aria-label="quest" name="quest">
                                <FormControlLabel value="再履修願" control={<Radio />} label="再履修願" />
                                <FormControlLabel value="年度内再評価願" control={<Radio />} label="年度内再評価願" />
                                <FormControlLabel value="入寮願" control={<Radio />} label="入寮願" />
                                <FormControlLabel value="退寮願" control={<Radio />} label="退寮願" />
                                <FormControlLabel value="退職願" control={<Radio />} label="退職願" />
                            </RadioGroup>
                        </FormControl>
                    </CardContent>
                </Card>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FormLabel component="legend">その他要望があればご記入ください。</FormLabel>
                            <TextField name="etc" />
                        </FormControl>
                    </CardContent>
                </Card>
                <Pay/>
                <Card style={{margin: '2vw'}}>
                    <Button variant="contained" color="primary" type="submit" endIcon={<Icon>send</Icon>}>確定</Button>
                </Card>
            </React.Fragment>
        );
    }
    function Pay() {
        return (
            <Card style={{margin: '2vw'}}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">支払い方法を選択してください。。</FormLabel>
                        <RadioGroup aria-label="pay" name="pay">
                            <FormControlLabel value="cash" control={<Radio required={true} />} label="当日現金払い" />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
        );
    }
    function Student() {
        return (
            <React.Fragment>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">学科をお答えください。</FormLabel>
                            <RadioGroup aria-label="sub" name="sub">
                                <FormControlLabel value="機械工学科" control={<Radio required={true} />} label="機械工学科" />
                                <FormControlLabel value="電気電子工学科" control={<Radio />} label="電気電子工学科" />
                                <FormControlLabel value="電子制御工学科" control={<Radio />} label="電子制御工学科" />
                                <FormControlLabel value="情報工学科" control={<Radio />} label="情報工学科" />
                                <FormControlLabel value="環境都市工学科" control={<Radio />} label="環境都市工学科" />
                                <FormControlLabel value="ME専攻科" control={<Radio />} label="ME専攻科" />
                                <FormControlLabel value="DJ専攻科" control={<Radio />} label="DJ専攻科" />
                                <FormControlLabel value="CC専攻科" control={<Radio />} label="CC専攻科" />
                            </RadioGroup>
                        </FormControl>
                    </CardContent>
                </Card>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">学年をお答えください。</FormLabel>
                            <RadioGroup aria-label="grade" name="grade">
                                <FormControlLabel value="1年" control={<Radio required={true} />} label="1年" />
                                <FormControlLabel value="2年" control={<Radio />} label="2年" />
                                <FormControlLabel value="3年" control={<Radio />} label="3年" />
                                <FormControlLabel value="4年" control={<Radio />} label="4年" />
                                <FormControlLabel value="5年" control={<Radio />} label="5年" />
                                <FormControlLabel value="専攻1年" control={<Radio />} label="専攻1年" />
                                <FormControlLabel value="専攻2年" control={<Radio />} label="専攻2年" />
                            </RadioGroup>
                        </FormControl>
                    </CardContent>
                </Card>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FormLabel component="legend">お名前をお書きください。</FormLabel>
                            <TextField required={true} name="name" />
                        </FormControl>
                    </CardContent>
                </Card>
                <Tshirt />
                <Quest />
            </React.Fragment>
        );
    }
    function Civilian() {
        return (
            <React.Fragment>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <Typography variant="subtitle2" component="p">
                            電話番号は配送又はご連絡の際、メールアドレスはご連絡の用途に使用します。なるべくご記入ください
                        </Typography>
                    </CardContent>
                </Card>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FormLabel component="legend">ご連絡先の携帯番号をご記入ください(電話番号をお持ちでない方は、「なし」とお書きください)。</FormLabel>
                            <TextField required={true} name="tel" />
                        </FormControl>
                    </CardContent>
                </Card>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FormLabel component="legend">ご連絡先のメールアドレスをご記入ください。</FormLabel>
                            <TextField name="email" />
                        </FormControl>
                    </CardContent>
                </Card>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FormLabel component="legend">配送先ご住所をご記入ください。</FormLabel>
                            <TextField required={true} name="address" />
                        </FormControl>
                    </CardContent>
                </Card>
                <Card style={{margin: '2vw'}}>
                    <CardContent>
                        <FormControl component="fieldset" fullWidth={true}>
                            <FormLabel component="legend">ご宛名をお書きください。</FormLabel>
                            <TextField required={true} name="name" />
                        </FormControl>
                    </CardContent>
                </Card>
                <Tshirt/>
                <Quest/>
            </React.Fragment>
        );
    }
    return (
        <React.Fragment>
            <CssBaseline />
            <Card style={{margin: '2vw'}}>
                <CardContent>
                    <Typography variant="h4" component="h1">
                        文化祭 退学願 Tシャツ販売フォーム
                    </Typography>
                    <Typography variant="subtitle2" component="p">
                        ご購入頂きありがとうございます！<br />
                        昨日から予想を上回る販売となり、おかげさまで店頭在庫が売り切れてしまいました。<br />
                        大変申し訳ありませんが後日、受注して発送いたします。大変申し訳ございません。<br />
                        7~10日程でご用意ができると思いますので、少々お持ちください。<br />
                        重ね重ね大変恐縮ですが、ご購入本当にありがとうございます。<br />
                        この後もぜひ木更津高専文化祭をお楽しみください。<br /><br />

                        木更津高専 4年情報工学科　川名 健太
                    </Typography>
                </CardContent>
            </Card>
            <Card style={{margin: '2vw'}}>
                <CardContent>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">木更津高専生ですか？</FormLabel>
                        <RadioGroup aria-label="out" name="out" value={value} onChange={handleChange}>
                            <FormControlLabel value="yes" control={<Radio />} label="はい (基本的に学校での手渡しとなります)" />
                            <FormControlLabel value="no" control={<Radio />} label="いいえ (後日、配送となります)" />
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
            <form onSubmit={submit}>
                {value && (value==='yes' ? <Student/> : <Civilian/>)}
            </form>
        </React.Fragment>
    );
}
