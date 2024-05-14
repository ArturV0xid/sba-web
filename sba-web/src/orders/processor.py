from datetime import datetime
from typing import Any
from auth.manager import User
import pandas as pd
import tabula

codes = pd.read_csv("src/mcc.csv", sep=";").set_index("mcc").to_dict()["type"]

def parse_pdf(file, user: User) -> list[dict[Any, Any]]:
    df = pd.DataFrame()
    temp_df = pd.concat(tabula.read_pdf(file, lattice=True, pages="all"))

    if "Дата и\rвремя\rсовершения" in temp_df.columns:
        temp_df = temp_df[temp_df["МСС категория"] != "―"]
        df["date"] = temp_df["Дата и\rвремя\rсовершения"].apply(lambda x: datetime.strptime(x, "%d.%m.%Y %H:%M:%S").date())
        df["type"] = temp_df["МСС категория"].astype(int).map(codes) + " (БНБ)"
        df[["amount", "currency"]] = temp_df["Сумма в\rвалюте\rоперации"].str.split(" ", expand=True)
        df["amount"] = df["amount"].str.replace(",", ".").astype(float)
        df["user_id"] = user.id
    elif "Дата и время\rзапроса" in temp_df.columns:
        df["date"] = temp_df["Дата и время\rзапроса"].apply(lambda x: datetime.strptime(x, "%d.%m.%Y %H:%M").date())
        df["type"] = temp_df["Наименование операции"] + " (MБеларусьБанк)"
        df["amount"] = temp_df["Сумма"].astype(float)
        df["currency"] = temp_df["Валюта"]
        df["user_id"] = user.id
    else:
        return None

    return df.to_dict("records")

def parse_csv(file, user: User) -> list[dict[Any, Any]]:
    raise NotImplementedError
